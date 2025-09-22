import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NavigationTest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const testRoutes = [
    { path: '/secretaria', name: 'Secretaria' },
    { path: '/atendimento', name: 'Atendimento' },
    { path: '/agenda', name: 'Agenda' },
    { path: '/financeiro', name: 'Financeiro' },
    { path: '/estoque', name: 'Estoque' },
    { path: '/secretaria/pacientes', name: 'Secretaria Pacientes' },
    { path: '/demo', name: 'Demo' },
    { path: '/relatorios', name: 'Relatórios' },
    { path: '/licencas', name: 'Licenças' },
    { path: '/unidades', name: 'Unidades' },
    { path: '/configuracoes', name: 'Configurações' },
  ];

  const handleNavigation = (path: string) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Navigation Test Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Current location: <code>{location.pathname}</code>
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {testRoutes.map((route) => (
                <Button
                  key={route.path}
                  variant="outline"
                  onClick={() => handleNavigation(route.path)}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <span className="font-medium">{route.name}</span>
                  <span className="text-xs text-gray-500">{route.path}</span>
                </Button>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Instructions:</h3>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Click each button above to test navigation</li>
                <li>2. Check the browser console for any errors</li>
                <li>3. Verify that the URL changes in the address bar</li>
                <li>4. Check if the page content changes</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavigationTest;
