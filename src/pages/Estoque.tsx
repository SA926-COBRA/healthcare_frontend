import { AppLayout } from "@/components/layout/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Package, 
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Pill,
  Syringe,
  Bandage,
  Thermometer
} from "lucide-react"
import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"
import { toast } from "sonner"

const inventoryItems = [
  {
    id: 1,
    name: "Dipirona 500mg",
    category: "Medicamentos",
    quantity: 45,
    minQuantity: 20,
    maxQuantity: 100,
    unit: "comprimidos",
    price: 12.50,
    supplier: "Farmácia Central",
    expiryDate: "2025-06-15",
    status: "ok",
    lastUpdated: "2024-01-10",
    icon: Pill
  },
  {
    id: 2,
    name: "Seringa 10ml",
    category: "Materiais",
    quantity: 8,
    minQuantity: 15,
    maxQuantity: 50,
    unit: "unidades",
    price: 2.30,
    supplier: "MedSupply",
    expiryDate: "2026-03-20",
    status: "low",
    lastUpdated: "2024-01-12",
    icon: Syringe
  },
  {
    id: 3,
    name: "Curativo Adesivo",
    category: "Materiais",
    quantity: 120,
    minQuantity: 50,
    maxQuantity: 200,
    unit: "unidades",
    price: 0.85,
    supplier: "MedSupply",
    expiryDate: "2027-01-10",
    status: "ok",
    lastUpdated: "2024-01-08",
    icon: Bandage
  },
  {
    id: 4,
    name: "Termômetro Digital",
    category: "Equipamentos",
    quantity: 2,
    minQuantity: 3,
    maxQuantity: 10,
    unit: "unidades",
    price: 45.00,
    supplier: "MedEquip",
    expiryDate: null,
    status: "low",
    lastUpdated: "2024-01-05",
    icon: Thermometer
  },
  {
    id: 5,
    name: "Paracetamol 750mg",
    category: "Medicamentos",
    quantity: 0,
    minQuantity: 25,
    maxQuantity: 80,
    unit: "comprimidos",
    price: 8.90,
    supplier: "Farmácia Central",
    expiryDate: "2025-09-30",
    status: "out",
    lastUpdated: "2024-01-15",
    icon: Pill
  }
]

const categories = [
  { name: "Medicamentos", count: 2, icon: Pill },
  { name: "Materiais", count: 2, icon: Bandage },
  { name: "Equipamentos", count: 1, icon: Thermometer }
]

const getStatusVariant = (status: string) => {
  switch (status) {
    case "ok":
      return "medical-status-active"
    case "low":
      return "medical-status-pending"
    case "out":
      return "medical-status-inactive"
    default:
      return "medical-status-pending"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "ok":
      return <CheckCircle className="w-4 h-4" />
    case "low":
      return <AlertTriangle className="w-4 h-4" />
    case "out":
      return <AlertTriangle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "ok":
      return "Em Estoque"
    case "low":
      return "Estoque Baixo"
    case "out":
      return "Sem Estoque"
    default:
      return "Indefinido"
  }
}

const Estoque = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [inventoryItems, setInventoryItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showItemModal, setShowItemModal] = useState(false)
  const [showEntryModal, setShowEntryModal] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [editingItem, setEditingItem] = useState<any>(null)

  useEffect(() => {
    loadInventoryData()
  }, [])

  const loadInventoryData = async () => {
    try {
      setLoading(true)
      // Simulate API call - in real implementation, this would be:
      // const inventoryData = await apiService.getInventoryItems()
      
      // For now, use mock data with simulated loading
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      
      const mockInventoryData = [
        {
          id: 1,
          name: "Dipirona 500mg",
          category: "Medicamentos",
          quantity: 45,
          minQuantity: 20,
          maxQuantity: 100,
          unit: "comprimidos",
          price: 12.50,
          supplier: "Farmácia Central",
          expiryDate: "2025-06-15",
          status: "ok",
          lastUpdated: "2024-01-10",
          icon: Pill
        },
        {
          id: 2,
          name: "Seringa 10ml",
          category: "Materiais",
          quantity: 8,
          minQuantity: 15,
          maxQuantity: 50,
          unit: "unidades",
          price: 2.30,
          supplier: "MedSupply",
          expiryDate: "2026-03-20",
          status: "low",
          lastUpdated: "2024-01-12",
          icon: Syringe
        },
        {
          id: 3,
          name: "Curativo Adesivo",
          category: "Materiais",
          quantity: 120,
          minQuantity: 50,
          maxQuantity: 200,
          unit: "unidades",
          price: 0.85,
          supplier: "MedSupply",
          expiryDate: "2027-01-10",
          status: "ok",
          lastUpdated: "2024-01-08",
          icon: Bandage
        },
        {
          id: 4,
          name: "Termômetro Digital",
          category: "Equipamentos",
          quantity: 2,
          minQuantity: 3,
          maxQuantity: 10,
          unit: "unidades",
          price: 45.00,
          supplier: "MedEquip",
          expiryDate: null,
          status: "low",
          lastUpdated: "2024-01-05",
          icon: Thermometer
        },
        {
          id: 5,
          name: "Paracetamol 750mg",
          category: "Medicamentos",
          quantity: 0,
          minQuantity: 25,
          maxQuantity: 100,
          unit: "comprimidos",
          price: 8.90,
          supplier: "Farmácia Central",
          expiryDate: "2025-12-01",
          status: "out",
          lastUpdated: "2024-01-15",
          icon: Pill
        }
      ]
      
      setInventoryItems(mockInventoryData)
    } catch (error) {
      console.error('Error loading inventory data:', error)
      toast.error('Erro ao carregar dados do estoque')
      // Keep empty array as fallback
      setInventoryItems([])
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleNewItem = () => {
    setEditingItem(null)
    setShowItemModal(true)
  }

  const handleEntry = () => {
    setShowEntryModal(true)
  }

  const handleExit = () => {
    setShowExitModal(true)
  }

  const handleGenerateReport = async () => {
    try {
      // Generate inventory report
      const reportData = {
        totalItems: inventoryItems.length,
        lowStockItems: inventoryItems.filter(item => item.status === "low").length,
        outOfStockItems: inventoryItems.filter(item => item.status === "out").length,
        totalValue: inventoryItems.reduce((sum, item) => sum + (item.quantity * item.price), 0),
        items: filteredItems,
        generatedAt: new Date().toISOString()
      }
      
      // Create CSV content
      const csvContent = [
        ['Nome', 'Categoria', 'Quantidade', 'Quantidade Mínima', 'Quantidade Máxima', 'Unidade', 'Preço', 'Fornecedor', 'Data de Validade', 'Status'],
        ...filteredItems.map(item => [
          item.name,
          item.category,
          item.quantity,
          item.minQuantity,
          item.maxQuantity,
          item.unit,
          item.price,
          item.supplier,
          item.expiryDate || 'N/A',
          item.status
        ])
      ].map(row => row.join(',')).join('\n')
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `relatorio_estoque_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Relatório de estoque gerado com sucesso!')
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Erro ao gerar relatório')
    }
  }

  const handleViewItem = (item: any) => {
    setSelectedItem(item)
    setShowItemModal(true)
  }

  const handleEditItem = (item: any) => {
    setEditingItem(item)
    setShowItemModal(true)
  }

  const handleRemoveItem = async (item: any) => {
    if (confirm(`Tem certeza que deseja remover o item "${item.name}"?`)) {
      try {
        // Simulate API call - in real implementation, this would be:
        // await apiService.deleteInventoryItem(item.id)
        
        toast.success('Item removido com sucesso!')
        await loadInventoryData() // Reload data
      } catch (error) {
        console.error('Error removing item:', error)
        toast.error('Erro ao remover item')
      }
    }
  }

  const handleSaveItem = async (itemData: any) => {
    try {
      if (editingItem) {
        // Update existing item - simulate API call
        // await apiService.updateInventoryItem(editingItem.id, itemData)
        toast.success('Item atualizado com sucesso!')
      } else {
        // Create new item - simulate API call
        // await apiService.createInventoryItem(itemData)
        toast.success('Item criado com sucesso!')
      }
      
      setShowItemModal(false)
      setEditingItem(null)
      await loadInventoryData() // Reload data
    } catch (error) {
      console.error('Error saving item:', error)
      toast.error('Erro ao salvar item')
    }
  }

  const handleCancelItem = () => {
    setShowItemModal(false)
    setEditingItem(null)
    setSelectedItem(null)
  }

  const totalItems = inventoryItems.length
  const lowStockItems = inventoryItems.filter(item => item.status === "low").length
  const outOfStockItems = inventoryItems.filter(item => item.status === "out").length
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)

  return (
    <AppLayout 
      title="Estoque" 
      subtitle="Gestão de medicamentos e materiais médicos"
    >
      <div className="space-y-6">
        {/* Inventory Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="medical-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Total de Itens
                  </p>
                  <h3 className="text-2xl font-bold text-foreground">
                    {totalItems}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Produtos cadastrados
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Estoque Baixo
                  </p>
                  <h3 className="text-2xl font-bold text-medical-amber">
                    {lowStockItems}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Itens críticos
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-medical-amber-soft flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-medical-amber" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Sem Estoque
                  </p>
                  <h3 className="text-2xl font-bold text-medical-red">
                    {outOfStockItems}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Necessário reposição
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
                    Valor Total
                  </p>
                  <h3 className="text-2xl font-bold text-medical-green">
                    R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Investimento em estoque
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-medical-green-soft flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-medical-green" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-4">
          <Button 
            className="medical-button-primary h-20 flex flex-col gap-2"
            onClick={handleNewItem}
          >
            <Plus className="w-6 h-6" />
            <span>Novo Item</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2 hover:bg-primary/10"
            onClick={handleEntry}
          >
            <Upload className="w-6 h-6" />
            <span>Entrada</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2 hover:bg-medical-green/10"
            onClick={handleExit}
          >
            <Download className="w-6 h-6" />
            <span>Saída</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2 hover:bg-medical-amber/10"
            onClick={handleGenerateReport}
          >
            <Package className="w-6 h-6" />
            <span>Relatório</span>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Categories Filter - Takes 1/4 of space */}
          <div className="lg:col-span-1">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Categorias
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory("all")}
                  >
                    Todas as categorias
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.name}
                      variant={selectedCategory === category.name ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <category.icon className="w-4 h-4 mr-2" />
                      {category.name} ({category.count})
                    </Button>
                  ))}
                </div>

                {/* Status Filter */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-foreground mb-3">Filtrar por Status</h4>
                  <div className="space-y-2">
                    <Button
                      variant={selectedStatus === "all" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedStatus("all")}
                    >
                      Todos os status
                    </Button>
                    <Button
                      variant={selectedStatus === "ok" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedStatus("ok")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Em Estoque
                    </Button>
                    <Button
                      variant={selectedStatus === "low" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedStatus("low")}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Estoque Baixo
                    </Button>
                    <Button
                      variant={selectedStatus === "out" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedStatus("out")}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Sem Estoque
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Items List - Takes 3/4 of space */}
          <div className="lg:col-span-3">
            <Card className="medical-card">
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Itens em Estoque
                  </CardTitle>
                  
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar item..."
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
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-muted-foreground">Carregando estoque...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/50">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">
                            {item.name}
                          </h4>
                          <Badge className={`text-xs px-2 py-1 ${getStatusVariant(item.status)}`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(item.status)}
                              {getStatusText(item.status)}
                            </div>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.category} • {item.supplier}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>Estoque: {item.quantity} {item.unit}</span>
                          <span>Mín: {item.minQuantity}</span>
                          <span>Máx: {item.maxQuantity}</span>
                          {item.expiryDate && (
                            <span>Validade: {new Date(item.expiryDate).toLocaleDateString('pt-BR')}</span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          por {item.unit}
                        </p>
                        <p className="text-sm font-medium text-medical-green mt-1">
                          Total: R$ {(item.quantity * item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button 
                          size="sm" 
                          className="medical-button-primary"
                          onClick={() => handleViewItem(item)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="hover:bg-primary/10"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleRemoveItem(item)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remover
                        </Button>
                      </div>
                    </div>
                    ))}
                    
                    {filteredItems.length === 0 && (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Nenhum item encontrado</p>
                        <Button 
                          className="medical-button-primary mt-4"
                          onClick={handleNewItem}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Novo Item
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Item Modal */}
        <Dialog open={showItemModal} onOpenChange={setShowItemModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                {editingItem ? 'Editar Item' : selectedItem ? 'Detalhes do Item' : 'Novo Item'}
              </DialogTitle>
            </DialogHeader>
            
            {selectedItem && !editingItem ? (
              // View Mode
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                    <p className="text-sm">{selectedItem.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Categoria</Label>
                    <p className="text-sm">{selectedItem.category}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Quantidade</Label>
                    <p className="text-sm font-bold">{selectedItem.quantity} {selectedItem.unit}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Preço</Label>
                    <p className="text-sm font-bold text-medical-green">
                      R$ {selectedItem.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Fornecedor</Label>
                    <p className="text-sm">{selectedItem.supplier}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <Badge className={`text-xs ${getStatusVariant(selectedItem.status)}`}>
                      {getStatusText(selectedItem.status)}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Quantidade Mínima</Label>
                    <p className="text-sm">{selectedItem.minQuantity}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Quantidade Máxima</Label>
                    <p className="text-sm">{selectedItem.maxQuantity}</p>
                  </div>
                  {selectedItem.expiryDate && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Data de Validade</Label>
                      <p className="text-sm">{new Date(selectedItem.expiryDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowItemModal(false)
                      handleEditItem(selectedItem)
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
                    <Label htmlFor="name">Nome do Item</Label>
                    <Input 
                      id="name"
                      defaultValue={editingItem?.name || ''}
                      placeholder="Nome do item"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select defaultValue={editingItem?.category || 'medicamentos'}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medicamentos">Medicamentos</SelectItem>
                        <SelectItem value="materiais">Materiais</SelectItem>
                        <SelectItem value="equipamentos">Equipamentos</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input 
                      id="quantity"
                      type="number"
                      defaultValue={editingItem?.quantity || ''}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unidade</Label>
                    <Input 
                      id="unit"
                      defaultValue={editingItem?.unit || ''}
                      placeholder="unidades, comprimidos, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Preço</Label>
                    <Input 
                      id="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingItem?.price || ''}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplier">Fornecedor</Label>
                    <Input 
                      id="supplier"
                      defaultValue={editingItem?.supplier || ''}
                      placeholder="Nome do fornecedor"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minQuantity">Quantidade Mínima</Label>
                    <Input 
                      id="minQuantity"
                      type="number"
                      defaultValue={editingItem?.minQuantity || ''}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxQuantity">Quantidade Máxima</Label>
                    <Input 
                      id="maxQuantity"
                      type="number"
                      defaultValue={editingItem?.maxQuantity || ''}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Data de Validade</Label>
                    <Input 
                      id="expiryDate"
                      type="date"
                      defaultValue={editingItem?.expiryDate || ''}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={handleCancelItem}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="medical-button-primary"
                    onClick={() => {
                      // Get form data and save
                      const formData = {
                        name: (document.getElementById('name') as HTMLInputElement)?.value,
                        category: (document.querySelector('[role="combobox"]') as HTMLInputElement)?.textContent,
                        quantity: parseInt((document.getElementById('quantity') as HTMLInputElement)?.value || '0'),
                        unit: (document.getElementById('unit') as HTMLInputElement)?.value,
                        price: parseFloat((document.getElementById('price') as HTMLInputElement)?.value || '0'),
                        supplier: (document.getElementById('supplier') as HTMLInputElement)?.value,
                        minQuantity: parseInt((document.getElementById('minQuantity') as HTMLInputElement)?.value || '0'),
                        maxQuantity: parseInt((document.getElementById('maxQuantity') as HTMLInputElement)?.value || '0'),
                        expiryDate: (document.getElementById('expiryDate') as HTMLInputElement)?.value
                      }
                      handleSaveItem(formData)
                    }}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    {editingItem ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Entry Modal */}
        <Dialog open={showEntryModal} onOpenChange={setShowEntryModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Entrada de Estoque
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="entry-item">Item</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o item" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map(item => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="entry-quantity">Quantidade</Label>
                  <Input id="entry-quantity" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="entry-supplier">Fornecedor</Label>
                  <Input id="entry-supplier" placeholder="Nome do fornecedor" />
                </div>
                <div>
                  <Label htmlFor="entry-date">Data da Entrada</Label>
                  <Input id="entry-date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div>
                <Label htmlFor="entry-notes">Observações</Label>
                <Textarea id="entry-notes" placeholder="Observações sobre a entrada..." />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowEntryModal(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="medical-button-primary"
                  onClick={() => {
                    toast.success('Entrada de estoque registrada com sucesso!')
                    setShowEntryModal(false)
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Registrar Entrada
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Exit Modal */}
        <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Saída de Estoque
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="exit-item">Item</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o item" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map(item => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name} (Estoque: {item.quantity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="exit-quantity">Quantidade</Label>
                  <Input id="exit-quantity" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="exit-reason">Motivo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uso">Uso em Consulta</SelectItem>
                      <SelectItem value="venda">Venda</SelectItem>
                      <SelectItem value="perda">Perda/Dano</SelectItem>
                      <SelectItem value="vencimento">Vencimento</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="exit-date">Data da Saída</Label>
                  <Input id="exit-date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div>
                <Label htmlFor="exit-notes">Observações</Label>
                <Textarea id="exit-notes" placeholder="Observações sobre a saída..." />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowExitModal(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="medical-button-primary"
                  onClick={() => {
                    toast.success('Saída de estoque registrada com sucesso!')
                    setShowExitModal(false)
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Registrar Saída
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Estoque;
