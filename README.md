# Gestão de Apiários - App Mobile

Uma aplicação React Native para a gestão completa de apiários, colmeias e materiais apícolas.

## Sobre o Projeto

Esta aplicação foi desenvolvida para apicultores que precisam de uma ferramenta eficiente para monitorar e gerenciar seus apiários. O sistema permite o acompanhamento detalhado das condições das colmeias, rastreamento de materiais, e monitoramento de condições climáticas que afetam a atividade das abelhas.

### Principais Funcionalidades

- **Dashboard interativo** com estatísticas e gráficos
- **Gestão de Apiários** com localização e condições específicas
- **Controle de Colmeias** por condição (boas, fortes, fracas, mortas)
- **Inventário de Materiais** utilizados em cada apiário
- **Monitoramento climático** com atualizações de condições
- **Registro de visitas** para acompanhamento histórico

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

## Evolução Planejada

Este projeto continuará evoluindo nas seguintes direções:

### Fase 1 (Atual)
- Interface básica para gestão de apiários, colmeias e materiais
- Dashboard com estatísticas e gráficos
- Monitoramento climático básico

### Fase 2
- Persistência de dados com AsyncStorage
- Suporte a fotografias para documentação visual
- Notificações para lembrar o apicultor de tarefas pendentes
- Melhorias de UI/UX com tema escuro

### Fase 3
- Integração com APIs de previsão do tempo
- Sincronização com servidor remoto
- Rastreamento de produção de mel e outros produtos
- Relatórios avançados e análise de tendências

### Fase 4
- Suporte a múltiplos usuários e equipes
- Recursos de planejamento e calendário
- Integração com dispositivos IoT para monitoramento remoto
- Aplicação web complementar

## Tecnologias

- React Native & Expo
- TypeScript
- Victory Native para visualização de dados
- Context API para gerenciamento de estado

## Contribuições

Este é um projeto em evolução contínua. Sugestões e contribuições são bem-vindas!
