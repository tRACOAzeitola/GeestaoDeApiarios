# Gestão de Apiários - App Mobile

Uma aplicação React Native para a gestão completa de apiários, colmeias e materiais apícolas.

## Sobre o Projeto

Esta aplicação foi desenvolvida para apicultores que precisam de uma ferramenta eficiente para monitorar e gerenciar seus apiários. O sistema permite o acompanhamento detalhado das condições das colmeias, rastreamento de materiais, e monitoramento de condições climáticas que afetam a atividade das abelhas.

### Funcionalidades Implementadas

- **Dashboard Completo**:
  - Contadores totais de apiários e colmeias
  - Visualização gráfica das condições das colmeias (Victory Charts)
  - Lista de apiários recentes com detalhes
  - Colmeias que necessitam de atenção prioritária
  - Sistema de legenda para classificação visual
  
- **Gestão de Apiários**:
  - Formulário para adição de novos apiários
  - Validação de campos obrigatórios
  - Registro de coordenadas e tipo de flora
  
- **Controle de Colmeias**:
  - Adição de colmeias em lote por estado (boas, fortes, fracas, mortas)
  - Sistema visual de classificação com marcadores físicos
  - Observações específicas por lote de colmeias
  
- **Inventário de Materiais**:
  - Registro de materiais apícolas por apiário
  - Controle de quantidades e tipos de equipamentos
  - Interface intuitiva para gestão de estoque
  
- **Monitoramento Climático**:
  - Registro das condições meteorológicas (temperatura, condição, umidade)
  - Histórico de visitas com datas
  - Visualização das condições atuais por apiário
  - Ícones dinâmicos baseados no clima
  
- **Sistema de Estado Global**:
  - Context API para gerenciamento centralizado de dados
  - Compartilhamento de informações entre telas
  - Funções reutilizáveis para operações comuns

## Como Iniciar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie a aplicação:
   ```bash
   npx expo start
   ```

## Convenções do Projeto

A aplicação utiliza um sistema de classificação das colmeias baseado em marcações físicas:

- 🪨 1 pedra ao meio - Colmeia boa
- 🪨🪨 2 pedras ao meio - Colmeia forte
- ↖️🪨 1 pedra à esquerda - Colmeia fraca
- 🥢 1 pau ao meio - Colmeia morta

Este sistema facilita a identificação visual rápida no campo e é refletido na interface do aplicativo.

## Evolução Planejada

Este projeto continuará evoluindo nas seguintes direções:

### Fase 1 (Concluída)
- ✅ Interface completa para gestão de apiários, colmeias e materiais
- ✅ Dashboard com estatísticas e gráficos interativos
- ✅ Monitoramento climático e registro de visitas
- ✅ Formulários com validação e feedback visual
- ✅ Design responsivo e intuitivo

### Fase 2 (Próximos Passos)
- Persistência de dados com AsyncStorage
- Suporte a fotografias para documentação visual dos apiários
- Sistema de notificações para tarefas pendentes e alertas
- Melhorias de UI/UX com tema escuro e animações
- Filtros e buscas avançadas para grandes conjuntos de dados
- Controle de produção por colmeia (mel, própolis, etc.)

### Fase 3 (Médio Prazo)
- Integração com APIs reais de previsão do tempo (OpenWeatherMap, etc.)
- Sincronização com servidor remoto (Firebase ou servidor dedicado)
- Rastreamento de produção de mel e outros produtos apícolas
- Relatórios avançados e análise de tendências com exportação
- Calendário de atividades e planejamento de visitas
- Alertas baseados em condições climáticas

### Fase 4 (Longo Prazo)
- Suporte a múltiplos usuários e gerenciamento de equipes
- Recursos avançados de planejamento e calendário compartilhado
- Integração com dispositivos IoT para monitoramento remoto
- Aplicação web complementar com dashboard administrativo
- Análise preditiva para otimização de produção
- Sistema offline-first com sincronização inteligente
- Suporte a múltiplos idiomas e regionalização

## Tecnologias Utilizadas

- **React Native & Expo**: base do desenvolvimento mobile
- **TypeScript**: para tipagem estática e melhor manutenção do código
- **Victory Native**: para visualização de dados e gráficos interativos
- **Context API**: para gerenciamento de estado global
- **React Navigation**: para navegação entre telas
- **@react-native-picker/picker**: para seletores de opções
- **react-native-reanimated**: para animações fluidas (em implementação)
- **Ionicons**: para sistema de ícones consistente

## Contribuições

Este é um projeto em evolução contínua. Sugestões e contribuições são bem-vindas!

Para contribuir:
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request
