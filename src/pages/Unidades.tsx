import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  MapPin, 
  Phone,
  Mail,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus
} from "lucide-react"
import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw
} from "lucide-react"

const Unidades = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnitForm, setShowUnitForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [statistics, setStatistics] = useState({
    totalUnits: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0
  });

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      setLoading(true);
      
      // Mock data for units
      const mockUnits = [
  {
    id: '1',
    name: 'Clínica Central',
    type: 'Matriz',
    status: 'active',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    phone: '(11) 3333-4444',
    email: 'central@clinica.com',
    doctors: 8,
    patients: 1247,
    appointments: 156,
    createdAt: new Date('2020-01-15'),
    lastSync: new Date('2024-01-15 14:30')
  },
  {
    id: '2',
    name: 'Unidade Norte',
    type: 'Filial',
    status: 'active',
          address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    phone: '(11) 3333-5555',
    email: 'norte@clinica.com',
          doctors: 5,
    patients: 892,
          appointments: 98,
          createdAt: new Date('2021-03-20'),
          lastSync: new Date('2024-01-15 12:15')
  },
  {
    id: '3',
    name: 'Unidade Sul',
    type: 'Filial',
    status: 'maintenance',
          address: 'Rua Augusta, 500',
    city: 'São Paulo',
    state: 'SP',
          zipCode: '01305-000',
    phone: '(11) 3333-6666',
    email: 'sul@clinica.com',
    doctors: 3,
    patients: 456,
          appointments: 45,
          createdAt: new Date('2022-06-10'),
          lastSync: new Date('2024-01-14 16:45')
        }
      ];
      
      setUnits(mockUnits);
      
      // Calculate statistics
      const totalUnits = mockUnits.length;
      const totalDoctors = mockUnits.reduce((sum, unit) => sum + unit.doctors, 0);
      const totalPatients = mockUnits.reduce((sum, unit) => sum + unit.patients, 0);
      const totalAppointments = mockUnits.reduce((sum, unit) => sum + unit.appointments, 0);
      
      setStatistics({
        totalUnits,
        totalDoctors,
        totalPatients,
        totalAppointments
      });
      
    } catch (error) {
      console.error('Error loading units:', error);
      toast.error('Erro ao carregar dados das unidades');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUnit = () => {
    setSelectedUnit(null);
    setShowUnitForm(true);
  };

  const handleEditUnit = (unit: any) => {
    setSelectedUnit(unit);
    setShowUnitForm(true);
  };

  const handleSaveUnit = async (unitData: any) => {
    try {
      if (selectedUnit) {
        // Update existing unit
        const updatedUnits = units.map(unit => 
          unit.id === selectedUnit.id 
            ? { ...unit, ...unitData }
            : unit
        );
        setUnits(updatedUnits);
        toast.success('Unidade atualizada com sucesso!');
      } else {
        // Create new unit
        const newUnit = {
          id: Date.now().toString(),
          ...unitData,
          createdAt: new Date(),
          lastSync: new Date()
        };
        setUnits(prev => [...prev, newUnit]);
        toast.success('Unidade criada com sucesso!');
      }
      
      setShowUnitForm(false);
      setSelectedUnit(null);
      await loadUnits(); // Reload data
    } catch (error) {
      console.error('Error saving unit:', error);
      toast.error('Erro ao salvar unidade');
    }
  };

  const handleCancelUnit = () => {
    setShowUnitForm(false);
    setSelectedUnit(null);
  };

  const handleDeleteUnit = async (unit: any) => {
    try {
      setUnits(prev => prev.filter(u => u.id !== unit.id));
      toast.success('Unidade excluída com sucesso!');
      setShowDeleteModal(false);
      await loadUnits(); // Reload data
    } catch (error) {
      console.error('Error deleting unit:', error);
      toast.error('Erro ao excluir unidade');
    }
  };

  const handleSyncUnit = async (unit: any) => {
    try {
      const updatedUnits = units.map(u => 
        u.id === unit.id 
          ? { ...u, lastSync: new Date() }
          : u
      );
      setUnits(updatedUnits);
      toast.success('Sincronização realizada com sucesso!');
      await loadUnits(); // Reload data
    } catch (error) {
      console.error('Error syncing unit:', error);
      toast.error('Erro ao sincronizar unidade');
    }
  };

  const handleActivateUnit = async (unit: any) => {
    try {
      const updatedUnits = units.map(u => 
        u.id === unit.id 
          ? { ...u, status: 'active' }
          : u
      );
      setUnits(updatedUnits);
      toast.success('Unidade ativada com sucesso!');
      await loadUnits(); // Reload data
    } catch (error) {
      console.error('Error activating unit:', error);
      toast.error('Erro ao ativar unidade');
    }
  };

  const handleExportUnits = async () => {
    try {
      const csvContent = [
        ['ID', 'Nome', 'Tipo', 'Status', 'Endereço', 'Cidade', 'Estado', 'CEP', 'Telefone', 'Email', 'Médicos', 'Pacientes', 'Consultas'],
        ...units.map(unit => [
          unit.id,
          unit.name,
          unit.type,
          unit.status,
          unit.address,
          unit.city,
          unit.state,
          unit.zipCode,
          unit.phone,
          unit.email,
          unit.doctors,
          unit.patients,
          unit.appointments
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `unidades_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Unidades exportadas com sucesso!');
    } catch (error) {
      console.error('Error exporting units:', error);
      toast.error('Erro ao exportar unidades');
    }
  };

  const handleImportUnits = () => {
    setShowImportModal(true);
  };

  const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
        return 'bg-green-100 text-green-800'
    case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
    case 'inactive':
        return 'bg-red-100 text-red-800'
    default:
        return 'bg-gray-100 text-gray-800'
  }
  };

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="w-4 h-4" />
    case 'maintenance':
      return <AlertTriangle className="w-4 h-4" />
    case 'inactive':
      return <XCircle className="w-4 h-4" />
    default:
      return <XCircle className="w-4 h-4" />
  }
  };

  if (loading) {
    return (
      <AppLayout 
        title="Unidades" 
        subtitle="Gestão de clínicas e unidades médicas"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando unidades...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title="Unidades" 
      subtitle="Gestão de clínicas e unidades médicas"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
                <div>
            <h1 className="text-2xl font-bold text-gray-900">Unidades</h1>
            <p className="text-gray-600">Gerencie as unidades médicas da clínica</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportUnits}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" onClick={handleImportUnits}>
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddUnit}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Unidade
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Building2 className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total de Unidades</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalUnits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total de Médicos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.totalDoctors}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total de Pacientes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.totalPatients}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Consultas Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.totalAppointments}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Units List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit) => (
            <Card key={unit.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{unit.name}</CardTitle>
                  <Badge className={getStatusColor(unit.status)}>
                    <div className="flex items-center">
                          {getStatusIcon(unit.status)}
                      <span className="ml-1 capitalize">{unit.status}</span>
                        </div>
                      </Badge>
                    </div>
                <p className="text-sm text-gray-600">{unit.type}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                      {unit.address}, {unit.city} - {unit.state}
                      </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {unit.phone}
                      </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {unit.email}
                    </div>
                  </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-blue-600">{unit.doctors}</p>
                    <p className="text-xs text-gray-600">Médicos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-green-600">{unit.patients}</p>
                    <p className="text-xs text-gray-600">Pacientes</p>
                </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-orange-600">{unit.appointments}</p>
                    <p className="text-xs text-gray-600">Consultas</p>
                    </div>
                  </div>
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500 mb-3">
                    Última sincronização: {unit.lastSync.toLocaleDateString('pt-BR')} às {unit.lastSync.toLocaleTimeString('pt-BR')}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditUnit(unit)}>
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleSyncUnit(unit)}>
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Sincronizar
                    </Button>
                    {unit.status === 'maintenance' && (
                      <Button size="sm" variant="outline" onClick={() => handleActivateUnit(unit)}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ativar
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50" onClick={() => {
                      setSelectedUnit(unit);
                      setShowDeleteModal(true);
                    }}>
                      <Trash2 className="w-3 h-3 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
            </CardContent>
          </Card>
          ))}
        </div>

        {/* Unit Form Modal */}
        {showUnitForm && (
          <UnitForm 
            initialData={selectedUnit}
            onSave={handleSaveUnit}
            onCancel={handleCancelUnit}
          />
        )}

        {/* Import Modal */}
        <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Importar Unidades
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="import-file">Arquivo CSV</Label>
                <Input 
                  id="import-file"
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      toast.success('Unidades importadas com sucesso!')
                      setShowImportModal(false)
                      loadUnits() // Reload data
                    }
                  }}
                  className="mt-2"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Formato esperado: CSV com cabeçalhos correspondentes aos campos das unidades</p>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowImportModal(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-500">
                <Trash2 className="w-5 h-5" />
                Confirmar Exclusão
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Tem certeza que deseja excluir a unidade <strong>{selectedUnit?.name}</strong>?
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteUnit(selectedUnit)}>
                  Excluir
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

// Unit Form Component
function UnitForm({ initialData, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'Filial',
    status: initialData?.status || 'active',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    doctors: initialData?.doctors || 0,
    patients: initialData?.patients || 0,
    appointments: initialData?.appointments || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {initialData ? "Editar Unidade" : "Nova Unidade"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome da Unidade</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Matriz">Matriz</SelectItem>
                  <SelectItem value="Filial">Filial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="doctors">Número de Médicos</Label>
              <Input
                id="doctors"
                type="number"
                value={formData.doctors}
                onChange={(e) => setFormData({ ...formData, doctors: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="patients">Número de Pacientes</Label>
              <Input
                id="patients"
                type="number"
                value={formData.patients}
                onChange={(e) => setFormData({ ...formData, patients: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="appointments">Consultas Hoje</Label>
              <Input
                id="appointments"
                type="number"
                value={formData.appointments}
                onChange={(e) => setFormData({ ...formData, appointments: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {initialData ? "Atualizar" : "Criar"} Unidade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Unidades;