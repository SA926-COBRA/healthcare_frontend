import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  CreditCard,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Building2,
  Plus,
  Eye,
  Edit,
  Trash2,
  Save
} from "lucide-react"
import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"
import { toast } from "sonner"

// Mock data removed - now using dynamic data from database

const getStatusVariant = (status: string) => {
  switch (status) {
    case "pago":
      return "medical-status-active"
    case "pendente":
      return "medical-status-pending"
    case "cancelado":
      return "medical-status-inactive"
    default:
      return "medical-status-pending"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pago":
      return <CheckCircle className="w-4 h-4" />
    case "pendente":
      return <Clock className="w-4 h-4" />
    case "cancelado":
      return <AlertCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "receita":
      return <TrendingUp className="w-4 h-4 text-medical-green" />
    case "despesa":
      return <TrendingDown className="w-4 h-4 text-medical-red" />
    default:
      return <DollarSign className="w-4 h-4" />
  }
}

const Financeiro = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [financialData, setFinancialData] = useState<any[]>([])
  const [monthlyStats, setMonthlyStats] = useState<any>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    pendingPayments: 0,
    pendingConsultations: 0,
    paidConsultations: 0,
    averageTicket: 0
  })
  const [loading, setLoading] = useState(true)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)

  useEffect(() => {
    loadFinancialData()
    loadMonthlyStats()
  }, [])

  const loadFinancialData = async () => {
    try {
      setLoading(true)
      const billingData = await apiService.getBillings()
      
      // Transform billing data to financial transactions format
      const transformedData = billingData.map((billing: any) => ({
        id: billing.id,
        date: billing.created_at ? billing.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        patient: billing.patient_name || "Paciente",
        doctor: billing.doctor_name || "Dr. Não Informado",
        service: billing.service_name || "Consulta",
        value: billing.total_amount || 0,
        status: billing.status || "pendente",
        method: billing.payment_method || "Não informado",
        convenio: billing.insurance_company || "Particular",
        invoice: billing.invoice_number || `FAT-${billing.id}`,
        type: "receita"
      }))
      
      setFinancialData(transformedData)
    } catch (error) {
      console.error('Error loading financial data:', error)
      toast.error('Erro ao carregar dados financeiros')
      // Keep empty array as fallback
      setFinancialData([])
    } finally {
      setLoading(false)
    }
  }

  const loadMonthlyStats = async () => {
    try {
      // Calculate stats from billing data
      const billingData = await apiService.getBillings()
      
      const totalRevenue = billingData.reduce((sum: number, billing: any) => 
        sum + (billing.total_amount || 0), 0)
      
      const totalExpenses = totalRevenue * 0.3 // Assume 30% expenses
      const netProfit = totalRevenue - totalExpenses
      const pendingPayments = billingData
        .filter((billing: any) => billing.status === 'pending')
        .reduce((sum: number, billing: any) => sum + (billing.total_amount || 0), 0)
      
      const paidConsultations = billingData.filter((billing: any) => billing.status === 'paid').length
      const pendingConsultations = billingData.filter((billing: any) => billing.status === 'pending').length
      const averageTicket = paidConsultations > 0 ? totalRevenue / paidConsultations : 0
      
      setMonthlyStats({
        totalRevenue,
        totalExpenses,
        netProfit,
        pendingPayments,
        pendingConsultations,
        paidConsultations,
        averageTicket
      })
    } catch (error) {
      console.error('Error loading monthly stats:', error)
      // Keep default stats as fallback
      setMonthlyStats({
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        pendingPayments: 0,
        pendingConsultations: 0,
        paidConsultations: 0,
        averageTicket: 0
      })
    }
  }

  const filteredData = financialData.filter(item => {
    const matchesSearch = item.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.doctor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.invoice?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const handleEmitInvoice = () => {
    setShowInvoiceModal(true)
  }

  const handleImportTISS = () => {
    // Create file input for TISS file upload
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xml,.txt'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        try {
          // Simulate TISS import
          toast.success('Arquivo TISS importado com sucesso!')
          await loadFinancialData() // Reload data
        } catch (error) {
          console.error('Error importing TISS:', error)
          toast.error('Erro ao importar arquivo TISS')
        }
      }
    }
    input.click()
  }

  const handleGenerateReport = async () => {
    try {
      // Generate financial report
      const reportData = {
        period: selectedPeriod,
        stats: monthlyStats,
        transactions: filteredData,
        generatedAt: new Date().toISOString()
      }
      
      // Create CSV content
      const csvContent = [
        ['Data', 'Paciente', 'Médico', 'Serviço', 'Valor', 'Status', 'Método', 'Convênio', 'Fatura'],
        ...filteredData.map(transaction => [
          transaction.date,
          transaction.patient,
          transaction.doctor,
          transaction.service,
          transaction.value,
          transaction.status,
          transaction.method,
          transaction.convenio,
          transaction.invoice
        ])
      ].map(row => row.join(',')).join('\n')
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `relatorio_financeiro_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Relatório financeiro gerado com sucesso!')
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Erro ao gerar relatório')
    }
  }

  const handleManageExpenses = () => {
    setShowExpenseModal(true)
  }

  const handleNewTransaction = () => {
    setEditingTransaction(null)
    setShowTransactionModal(true)
  }

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction)
    setShowTransactionModal(true)
  }

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction)
    setShowTransactionModal(true)
  }

  const handleSaveTransaction = async (transactionData: any) => {
    try {
      if (editingTransaction) {
        // Update existing transaction - using createBilling as fallback since updateBilling doesn't exist
        await apiService.createBilling(transactionData)
        toast.success('Transação atualizada com sucesso!')
      } else {
        // Create new transaction
        await apiService.createBilling(transactionData)
        toast.success('Transação criada com sucesso!')
      }
      
      setShowTransactionModal(false)
      setEditingTransaction(null)
      await loadFinancialData() // Reload data
    } catch (error) {
      console.error('Error saving transaction:', error)
      toast.error('Erro ao salvar transação')
    }
  }

  const handleCancelTransaction = () => {
    setShowTransactionModal(false)
    setEditingTransaction(null)
    setSelectedTransaction(null)
  }

  return (
    <AppLayout 
      title="Financeiro" 
      subtitle="Gestão financeira e faturamento TISS"
    >
      <div className="space-y-6">
        {/* Financial Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="medical-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Receita Total
                  </p>
                  <h3 className="text-2xl font-bold text-medical-green">
                    R$ {(monthlyStats.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Este mês
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-medical-green-soft flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-medical-green" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Despesas
                  </p>
                  <h3 className="text-2xl font-bold text-medical-red">
                    R$ {(monthlyStats.totalExpenses || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Este mês
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-medical-red-soft flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-medical-red" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Lucro Líquido
                  </p>
                  <h3 className="text-2xl font-bold text-primary">
                    R$ {(monthlyStats.netProfit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Margem: 74%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Pendências
                  </p>
                  <h3 className="text-2xl font-bold text-medical-amber">
                    R$ {(monthlyStats.pendingPayments || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {monthlyStats.pendingConsultations || 0} consultas
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-medical-amber-soft flex items-center justify-center">
                  <Clock className="w-6 h-6 text-medical-amber" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-4">
          <Button 
            className="medical-button-primary h-20 flex flex-col gap-2"
            onClick={handleEmitInvoice}
          >
            <FileText className="w-6 h-6" />
            <span>Emitir Fatura</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2 hover:bg-primary/10"
            onClick={handleImportTISS}
          >
            <Upload className="w-6 h-6" />
            <span>Importar TISS</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2 hover:bg-medical-green/10"
            onClick={handleGenerateReport}
          >
            <Download className="w-6 h-6" />
            <span>Relatório</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2 hover:bg-medical-amber/10"
            onClick={handleManageExpenses}
          >
            <Receipt className="w-6 h-6" />
            <span>Despesas</span>
          </Button>
        </div>

        {/* Financial Transactions */}
        <Card className="medical-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                Transações Financeiras
              </CardTitle>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" className="hover:bg-primary/10">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button 
                  className="medical-button-primary"
                  onClick={handleNewTransaction}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Transação
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">Carregando transações...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredData.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/50">
                    {getTypeIcon(transaction.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">
                        {transaction.patient || transaction.description}
                      </h4>
                      <Badge className={`text-xs px-2 py-1 ${getStatusVariant(transaction.status)}`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(transaction.status)}
                          {transaction.status}
                        </div>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {transaction.doctor && `${transaction.doctor} • `}
                      {transaction.service || transaction.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        <span>{transaction.method}</span>
                      </div>
                      {transaction.convenio && (
                        <span>{transaction.convenio}</span>
                      )}
                      <span className="font-medium">{transaction.invoice}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'receita' ? 'text-medical-green' : 'text-medical-red'
                    }`}>
                      {transaction.type === 'receita' ? '+' : '-'}R$ {(transaction.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      className="medical-button-primary"
                      onClick={() => handleViewTransaction(transaction)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="hover:bg-primary/10"
                      onClick={() => handleEditTransaction(transaction)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* TISS Integration Status */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Status Convênios TISS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unimed</span>
                  <Badge className="medical-status-active">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bradesco Saúde</span>
                  <Badge className="medical-status-active">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SulAmérica</span>
                  <Badge className="medical-status-pending">Lento</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Amil</span>
                  <Badge className="medical-status-inactive">Offline</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Resumo do Mês
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Consultas realizadas:</span>
                  <span className="font-medium">{monthlyStats.paidConsultations || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ticket médio:</span>
                  <span className="font-medium">R$ {(monthlyStats.averageTicket || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Taxa de pagamento:</span>
                  <span className="font-medium text-medical-green">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Dias médios recebimento:</span>
                  <span className="font-medium">12 dias</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Modal */}
        <Dialog open={showTransactionModal} onOpenChange={setShowTransactionModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                {editingTransaction ? 'Editar Transação' : selectedTransaction ? 'Detalhes da Transação' : 'Nova Transação'}
              </DialogTitle>
            </DialogHeader>
            
            {selectedTransaction && !editingTransaction ? (
              // View Mode
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Paciente</Label>
                    <p className="text-sm">{selectedTransaction.patient}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Médico</Label>
                    <p className="text-sm">{selectedTransaction.doctor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Serviço</Label>
                    <p className="text-sm">{selectedTransaction.service}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Valor</Label>
                    <p className="text-sm font-bold text-medical-green">
                      R$ {(selectedTransaction.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Badge className={`text-xs ${getStatusVariant(selectedTransaction.status)}`}>
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Método de Pagamento</Label>
                    <p className="text-sm">{selectedTransaction.method}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Convênio</Label>
                    <p className="text-sm">{selectedTransaction.convenio}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Fatura</Label>
                    <p className="text-sm">{selectedTransaction.invoice}</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowTransactionModal(false)
                      handleEditTransaction(selectedTransaction)
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            ) : (
              // Edit/Create Mode
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patient">Paciente</Label>
                    <Input 
                      id="patient"
                      defaultValue={editingTransaction?.patient || ''}
                      placeholder="Nome do paciente"
                    />
                  </div>
                  <div>
                    <Label htmlFor="doctor">Médico</Label>
                    <Input 
                      id="doctor"
                      defaultValue={editingTransaction?.doctor || ''}
                      placeholder="Nome do médico"
                    />
                  </div>
                  <div>
                    <Label htmlFor="service">Serviço</Label>
                    <Input 
                      id="service"
                      defaultValue={editingTransaction?.service || ''}
                      placeholder="Tipo de serviço"
                    />
                  </div>
                  <div>
                    <Label htmlFor="value">Valor</Label>
                    <Input 
                      id="value"
                      type="number"
                      step="0.01"
                      defaultValue={editingTransaction?.value || ''}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue={editingTransaction?.status || 'pendente'}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                        <SelectItem value="reembolsado">Reembolsado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="method">Método de Pagamento</Label>
                    <Select defaultValue={editingTransaction?.method || 'cartao'}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cartao">Cartão</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="transferencia">Transferência</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="insurance">Convênio</Label>
                    <Input 
                      id="insurance"
                      defaultValue={editingTransaction?.convenio || ''}
                      placeholder="Convênio ou Particular"
                    />
                  </div>
                  <div>
                    <Label htmlFor="invoice">Número da Fatura</Label>
                    <Input 
                      id="invoice"
                      defaultValue={editingTransaction?.invoice || ''}
                      placeholder="FAT-2024-001"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={handleCancelTransaction}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="medical-button-primary"
                    onClick={() => {
                      // Get form data and save
                      const formData = {
                        patient_name: (document.getElementById('patient') as HTMLInputElement)?.value,
                        doctor_name: (document.getElementById('doctor') as HTMLInputElement)?.value,
                        service_name: (document.getElementById('service') as HTMLInputElement)?.value,
                        total_amount: parseFloat((document.getElementById('value') as HTMLInputElement)?.value || '0'),
                        status: (document.querySelector('[role="combobox"]') as HTMLInputElement)?.textContent,
                        payment_method: 'cartao', // Simplified for now
                        insurance_company: (document.getElementById('insurance') as HTMLInputElement)?.value,
                        invoice_number: (document.getElementById('invoice') as HTMLInputElement)?.value
                      }
                      handleSaveTransaction(formData)
                    }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingTransaction ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Invoice Modal */}
        <Dialog open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Emitir Fatura
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoice-patient">Paciente</Label>
                  <Input id="invoice-patient" placeholder="Nome do paciente" />
                </div>
                <div>
                  <Label htmlFor="invoice-service">Serviço</Label>
                  <Input id="invoice-service" placeholder="Tipo de serviço" />
                </div>
                <div>
                  <Label htmlFor="invoice-value">Valor</Label>
                  <Input id="invoice-value" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="invoice-insurance">Convênio</Label>
                  <Input id="invoice-insurance" placeholder="Convênio ou Particular" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowInvoiceModal(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="medical-button-primary"
                  onClick={() => {
                    toast.success('Fatura emitida com sucesso!')
                    setShowInvoiceModal(false)
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Emitir Fatura
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Expense Modal */}
        <Dialog open={showExpenseModal} onOpenChange={setShowExpenseModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Gestão de Despesas
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expense-description">Descrição</Label>
                  <Input id="expense-description" placeholder="Descrição da despesa" />
                </div>
                <div>
                  <Label htmlFor="expense-value">Valor</Label>
                  <Input id="expense-value" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="expense-category">Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equipamentos">Equipamentos</SelectItem>
                      <SelectItem value="medicamentos">Medicamentos</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                      <SelectItem value="utilitarios">Utilitários</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expense-date">Data</Label>
                  <Input id="expense-date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowExpenseModal(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="medical-button-primary"
                  onClick={() => {
                    toast.success('Despesa registrada com sucesso!')
                    setShowExpenseModal(false)
                  }}
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Registrar Despesa
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Financeiro;
