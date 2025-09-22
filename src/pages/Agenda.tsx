import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AppointmentForm } from "@/components/forms/AppointmentForm"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"
import { toast } from "sonner"

const appointments = [
  {
    id: 1,
    date: "2024-01-15",
    time: "09:00",
    patient: "Maria Santos Silva",
    doctor: "Dr. João Santos",
    type: "Consulta de Rotina",
    status: "confirmado",
    phone: "(11) 99999-9999",
    convenio: "Unimed",
    avatar: "/api/placeholder/40/40",
    notes: "Retorno para controle de pressão"
  },
  {
    id: 2,
    date: "2024-01-15",
    time: "10:30",
    patient: "Carlos Eduardo Pereira",
    doctor: "Dra. Maria Costa",
    type: "Primeira Consulta",
    status: "aguardando",
    phone: "(11) 88888-8888",
    convenio: "Particular",
    avatar: "/api/placeholder/40/40",
    notes: "Dor no peito"
  },
  {
    id: 3,
    date: "2024-01-15",
    time: "14:00",
    patient: "Ana Lucia Costa",
    doctor: "Dr. Pedro Lima",
    type: "Telemedicina",
    status: "online",
    phone: "(11) 77777-7777",
    convenio: "Bradesco Saúde",
    avatar: "/api/placeholder/40/40",
    notes: "Consulta online"
  },
  {
    id: 4,
    date: "2024-01-16",
    time: "08:30",
    patient: "Roberto Santos",
    doctor: "Dra. Ana Oliveira",
    type: "Exame",
    status: "agendado",
    phone: "(11) 66666-6666",
    convenio: "SulAmérica",
    avatar: "/api/placeholder/40/40",
    notes: "Exame de sangue"
  },
  {
    id: 5,
    date: "2024-01-16",
    time: "11:00",
    patient: "Lucia Fernandes",
    doctor: "Dr. João Santos",
    type: "Retorno",
    status: "confirmado",
    phone: "(11) 55555-5555",
    convenio: "Unimed",
    avatar: "/api/placeholder/40/40",
    notes: "Controle diabetes"
  }
]

const doctors = [
  { id: 1, name: "Dr. João Santos", specialty: "Clínica Geral" },
  { id: 2, name: "Dra. Maria Costa", specialty: "Cardiologia" },
  { id: 3, name: "Dr. Pedro Lima", specialty: "Neurologia" },
  { id: 4, name: "Dra. Ana Oliveira", specialty: "Endocrinologia" }
]

const getStatusVariant = (status: string) => {
  switch (status) {
    case "confirmado":
      return "medical-status-active"
    case "aguardando":
      return "medical-status-pending"
    case "online":
      return "bg-blue-50 text-blue-700 border border-blue-200"
    case "agendado":
      return "medical-status-active"
    case "cancelado":
      return "medical-status-inactive"
    default:
      return "medical-status-pending"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "confirmado":
      return <CheckCircle className="w-4 h-4" />
    case "aguardando":
      return <Clock className="w-4 h-4" />
    case "online":
      return <AlertCircle className="w-4 h-4" />
    case "agendado":
      return <CalendarIcon className="w-4 h-4" />
    case "cancelado":
      return <XCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

const Agenda = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

  useEffect(() => {
    loadAppointments()
    loadDoctors()
  }, [])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const appointmentsData = await apiService.getAppointments()
      
      // Transform the data to match the expected format
      const transformedAppointments = appointmentsData.map((apt: any) => ({
        id: apt.id,
        date: apt.appointment_date ? apt.appointment_date.split('T')[0] : new Date().toISOString().split('T')[0],
        time: apt.appointment_date ? apt.appointment_date.split('T')[1]?.substring(0, 5) : "09:00",
        patient: apt.patient_name || "Paciente",
        doctor: apt.doctor_name || "Dr. Não Informado",
        type: apt.type || "Consulta",
        status: apt.status || "scheduled",
        phone: apt.patient_phone || "(11) 99999-9999",
        convenio: apt.insurance_company || "Particular",
        avatar: "/api/placeholder/40/40",
        notes: apt.reason || apt.notes || ""
      }))
      
      setAppointments(transformedAppointments)
    } catch (error) {
      console.error('Error loading appointments:', error)
      toast.error('Erro ao carregar agendamentos')
      // Keep mock data as fallback
      setAppointments(appointments)
    } finally {
      setLoading(false)
    }
  }

  const loadDoctors = async () => {
    try {
      const doctorsData = await apiService.getDoctors()
      setDoctors(doctorsData || [])
    } catch (error) {
      console.error('Error loading doctors:', error)
      // Keep mock doctors as fallback
      setDoctors(doctors)
    }
  }

  const handleAppointmentSave = async (appointment: any) => {
    try {
      if (editingAppointment) {
        // Update existing appointment
        await apiService.updateAppointment(editingAppointment.id, appointment)
        toast.success('Agendamento atualizado com sucesso!')
      } else {
        // Create new appointment
        await apiService.createAppointment(appointment)
        toast.success('Agendamento criado com sucesso!')
      }
      
      setShowAppointmentForm(false)
      setEditingAppointment(null)
      await loadAppointments() // Reload appointments
    } catch (error) {
      console.error('Error saving appointment:', error)
      toast.error('Erro ao salvar agendamento')
    }
  }

  const handleAppointmentCancel = () => {
    setShowAppointmentForm(false)
    setEditingAppointment(null)
  }

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment)
    setShowAppointmentForm(true)
  }

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setShowAppointmentModal(true)
  }

  const handleCancelAppointment = async (appointment: any) => {
    if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
      try {
        await apiService.updateAppointmentStatus(appointment.id, 'cancelled')
        toast.success('Agendamento cancelado com sucesso!')
        await loadAppointments() // Reload appointments
      } catch (error) {
        console.error('Error cancelling appointment:', error)
        toast.error('Erro ao cancelar agendamento')
      }
    }
  }

  const handleExportAgenda = async () => {
    try {
      const exportData = {
        date: selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        doctor: selectedDoctor,
        appointments: filteredAppointments
      }
      
      // Create CSV content
      const csvContent = [
        ['Data', 'Hora', 'Paciente', 'Médico', 'Tipo', 'Status', 'Telefone', 'Convênio', 'Observações'],
        ...filteredAppointments.map(apt => [
          apt.date,
          apt.time,
          apt.patient,
          apt.doctor,
          apt.type,
          apt.status,
          apt.phone,
          apt.convenio,
          apt.notes
        ])
      ].map(row => row.join(',')).join('\n')
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `agenda_${selectedDate?.toISOString().split('T')[0] || 'hoje'}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Agenda exportada com sucesso!')
    } catch (error) {
      console.error('Error exporting agenda:', error)
      toast.error('Erro ao exportar agenda')
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesDate = !selectedDate || appointment.date === selectedDate.toISOString().split('T')[0]
    const matchesDoctor = selectedDoctor === "all" || appointment.doctor.includes(selectedDoctor)
    const matchesSearch = appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.phone.includes(searchTerm) ||
                         appointment.convenio.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesDate && matchesDoctor && matchesSearch
  })

  if (showAppointmentForm) {
    return (
      <AppLayout 
        title={editingAppointment ? "Editar Agendamento" : "Novo Agendamento"} 
        subtitle="Agendar nova consulta médica"
      >
        <AppointmentForm 
          onSave={handleAppointmentSave}
          onCancel={handleAppointmentCancel}
          initialData={editingAppointment}
        />
      </AppLayout>
    )
  }

  return (
    <AppLayout 
      title="Agenda Médica" 
      subtitle="Gestão de agendamentos e consultas"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Button 
              className="medical-button-primary"
              onClick={() => setShowAppointmentForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </Button>
            <Button 
              variant="outline" 
              className="hover:bg-primary/10"
              onClick={handleExportAgenda}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Agenda
            </Button>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" className="hover:bg-primary/10">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Calendar - Takes 1/4 of space */}
          <div className="lg:col-span-1">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  Calendário
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-0"
                />
                
                {/* Doctor Filter */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-foreground mb-3">Filtrar por Médico</h4>
                  <div className="space-y-2">
                    <Button
                      variant={selectedDoctor === "all" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedDoctor("all")}
                    >
                      Todos os médicos
                    </Button>
                    {doctors.map((doctor) => (
                      <Button
                        key={doctor.id}
                        variant={selectedDoctor === doctor.name ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => setSelectedDoctor(doctor.name)}
                      >
                        {doctor.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments List - Takes 3/4 of space */}
          <div className="lg:col-span-3">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Agendamentos
                  </div>
                  <Badge className="medical-status-active">
                    {filteredAppointments.length} consultas
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-muted-foreground">Carregando agendamentos...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col items-center gap-1 min-w-0">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          {appointment.time}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(appointment.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={appointment.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {appointment.patient.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">
                            {appointment.patient}
                          </h4>
                          <Badge className={`text-xs px-2 py-1 ${getStatusVariant(appointment.status)}`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(appointment.status)}
                              {appointment.status}
                            </div>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {appointment.type} • {appointment.doctor}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{appointment.phone}</span>
                          </div>
                          <span>{appointment.convenio}</span>
                        </div>
                        {appointment.notes && (
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            {appointment.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button 
                          size="sm" 
                          className="medical-button-primary"
                          onClick={() => handleViewAppointment(appointment)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="hover:bg-primary/10"
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleCancelAppointment(appointment)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                    ))}
                    
                    {filteredAppointments.length === 0 && (
                      <div className="text-center py-8">
                        <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
                        <Button 
                          className="medical-button-primary mt-4"
                          onClick={() => setShowAppointmentForm(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Criar Novo Agendamento
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Appointment View Modal */}
        <Dialog open={showAppointmentModal} onOpenChange={setShowAppointmentModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Detalhes do Agendamento
              </DialogTitle>
            </DialogHeader>
            {selectedAppointment && (
              <div className="space-y-6">
                {/* Patient Info */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedAppointment.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {selectedAppointment.patient.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{selectedAppointment.patient}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{selectedAppointment.phone}</span>
                      </div>
                      <span>{selectedAppointment.convenio}</span>
                    </div>
                  </div>
                  <Badge className={`text-sm px-3 py-1 ${getStatusVariant(selectedAppointment.status)}`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedAppointment.status)}
                      {selectedAppointment.status}
                    </div>
                  </Badge>
                </div>

                {/* Appointment Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Data</label>
                      <p className="text-sm">{new Date(selectedAppointment.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Hora</label>
                      <p className="text-sm">{selectedAppointment.time}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Médico</label>
                      <p className="text-sm">{selectedAppointment.doctor}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tipo de Consulta</label>
                      <p className="text-sm">{selectedAppointment.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Convênio</label>
                      <p className="text-sm">{selectedAppointment.convenio}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <Badge className={`text-xs ${getStatusVariant(selectedAppointment.status)}`}>
                        {selectedAppointment.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedAppointment.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Observações</label>
                    <p className="text-sm mt-1 p-3 bg-muted/30 rounded-lg">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAppointmentModal(false)
                      handleEditAppointment(selectedAppointment)
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setShowAppointmentModal(false)
                      handleCancelAppointment(selectedAppointment)
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Agenda;
