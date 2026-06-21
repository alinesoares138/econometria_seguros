# 📊 Insurance Risk Analytics — Análise de Risco e Precificação em Seguros Automotivos

## Visão geral

Este projeto apresenta uma análise de negócio aplicada ao setor de seguros automotivos, utilizando estatística aplicada e econometria para investigar uma pergunta central:

> **A seguradora está cobrando o preço certo para o risco certo?**

O objetivo foi simular uma análise real de uma área de **Data Analytics / Business Intelligence** dentro de uma seguradora, avaliando risco, frequência de sinistros, precificação, custos de indenização e evolução da carteira.

[![Acessar Dashboard](https://img.shields.io/badge/🚀_Acessar_Dashboard-5383EC?style=for-the-badge&logoColor=white)](https://alinesoares138.github.io/dashboard-seguros-claude/)

# 🎯 Problema de negócio

Uma seguradora precisa equilibrar:

* crescimento comercial;
* competitividade de preço;
* controle de sinistralidade;
* sustentabilidade financeira.

Uma precificação inadequada pode gerar:

* perda de margem;
* aumento do Loss Ratio;
* exposição a clientes subprecificados;
* decisões baseadas em percepção, não em dados.

Este projeto investiga se os preços praticados refletem corretamente o perfil de risco dos segurados.

---

# 📌 Base de dados

A análise utiliza uma base simulada contendo:

* 1.000 apólices;
* período de Jan/2022 a Dez/2024;
* informações de perfil do cliente;
* histórico de sinistros;
* multas;
* valor do veículo;
* tipo de plano;
* mensalidade;
* indenizações.

⚠️ Os dados são 100% fictícios e foram gerados para fins educacionais e de portfólio. Não representam nenhuma seguradora ou cliente real.

---

# 🔎 Perguntas de negócio analisadas

## 1. Perfil de risco

**Existe um tipo de cliente mais propenso a sofrer sinistro?**

Método aplicado: Regressão Logística (Logit)

Objetivo: Estimar a probabilidade de ocorrência de sinistro considerando características do segurado.

Resultado: Os fatores analisados não apresentaram poder estatístico suficiente para explicar a ocorrência de sinistro nessa base.

Insight: A seguradora precisaria incorporar variáveis adicionais, como comportamento de direção, quilometragem e telemetria, para melhorar a segmentação de risco.

---

## 2. Frequência de sinistros

**Quais clientes acionam o seguro com maior frequência?**

Método aplicado: Regressão de Poisson

Objetivo: Modelar quantidade de eventos de sinistro por cliente.

Resultado: Nenhum perfil apresentou comportamento claramente reincidente.

Insight: A base não revelou grupos extremos de risco, indicando necessidade de variáveis mais explicativas.

---

## 3. Formação de preço

**O valor cobrado está relacionado ao risco real?**

Método aplicado: Regressão Linear Múltipla (MQO)

Variáveis avaliadas:

* idade;
* experiência de direção;
* valor do veículo;
* região;
* histórico de risco;
* tipo de plano.

Resultado: Os fatores analisados explicam menos de 1% da variação da mensalidade.

Insight: A régua de precificação simulada não apresenta forte relação com características de risco observadas.

---

## 4. Custo de indenização

**Quanto a seguradora paga e quais fatores influenciam esse custo?**

Método aplicado: Modelo Tobit

Motivo: Parte dos clientes possui indenização igual a zero, tornando necessário um modelo que trate corretamente essa censura dos dados.

Resultado: O valor médio de indenização ficou próximo de: **R$ 16 mil por sinistro**

Insight: Nenhuma característica analisada alterou significativamente o valor pago.

---

## 5. Justiça na precificação

**Existe diferença de preço sem diferença real de risco?**

Métodos aplicados:

* Teste t
* ANOVA

Comparações:

* homens vs mulheres;
* estados;
* grupos equivalentes de risco.

Resultado: Não foram encontradas diferenças estatisticamente significativas.

Insight: A política de preço simulada não apresentou evidência de discriminação por grupo.

---

## 6. Evolução do negócio

**O risco está aumentando ao longo do tempo?**

Método aplicado:

* Série temporal
* Teste ADF
* Análise YoY

Principais indicadores:

* volume de sinistros;
* custo total indenizado;
* Loss Ratio.

Resultado:

Entre 2023 e 2024:

* Sinistros: +17,4%
* Indenizações: +26,3%
* Loss Ratio aumentou

Insight: Mesmo sem tendência estatística confirmada, existe um sinal operacional de atenção: os custos crescem mais rápido que a receita.

---

# 🧠 Principais aprendizados de negócio

A análise demonstra como métodos quantitativos podem apoiar decisões:

✅ revisão de modelos de preço

✅ identificação de riscos ocultos

✅ acompanhamento de rentabilidade

✅ monitoramento de carteira

✅ decisões comerciais baseadas em evidência

---

# 🛠️ Tecnologias

* React
* Vite
* JavaScript
* GitHub Pages
* Estatística aplicada
* Econometria
* Modelagem preditiva

---

# 🤖 Uso de Inteligência Artificial 

Este projeto foi desenvolvido com apoio de Inteligência Artificial generativa utilizando o **Claude** como ferramenta de programação e aceleração de desenvolvimento.

O Claude foi utilizado para auxiliar em:

* estruturação do aplicativo;
* desenvolvimento dos componentes em React;
* organização do código;
* criação da interface do dashboard;
* implementação de visualizações e interações.

A lógica analítica, definição das perguntas de negócio, escolha dos métodos estatísticos e interpretação dos resultados foram construídas com foco em **Data Analytics, Estatística Aplicada e Econometria**.

Este projeto demonstra como ferramentas de IA podem ser integradas ao fluxo moderno de desenvolvimento, aumentando produtividade sem substituir a análise crítica e a tomada de decisão baseada em dados.

---

# 🚀 Como executar

Instalar dependências:
```bash
npm install
```
Executar localmente:
```bash
npm run dev
```
Publicar:
```bash
npm run deploy
```
---

# 👩‍💻 Autora

**Aline Soares**

Economista & Analista de dados 

LinkedIn:
https://www.linkedin.com/in/alinesoaress/

