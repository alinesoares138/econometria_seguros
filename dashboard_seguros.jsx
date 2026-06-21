import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';

const C = {
  bg: '#0B0C0E',
  panel: '#15171A',
  panel2: '#1B1E22',
  border: '#26292E',
  text: '#EDEEF0',
  sub: '#8A8F98',
  accent: '#FF5A3C',
  accent2: '#FF8B6E',
  green: '#3DDC84',
  red: '#FF5A3C',
  blue: '#5B8DEF',
  yellow: '#E8B84B',
};

const fonts = {
  display: "'Space Grotesk', 'Arial', sans-serif",
  body: "'Inter', 'Arial', sans-serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
};

// ---------- DATA ----------
const monthlySeries = [
  {m:'Jan/22',n:35},{m:'Fev/22',n:29},{m:'Mar/22',n:26},{m:'Abr/22',n:33},{m:'Mai/22',n:31},{m:'Jun/22',n:25},
  {m:'Jul/22',n:23},{m:'Ago/22',n:27},{m:'Set/22',n:23},{m:'Out/22',n:19},{m:'Nov/22',n:19},{m:'Dez/22',n:23},
  {m:'Jan/23',n:23},{m:'Fev/23',n:23},{m:'Mar/23',n:23},{m:'Abr/23',n:27},{m:'Mai/23',n:30},{m:'Jun/23',n:23},
  {m:'Jul/23',n:28},{m:'Ago/23',n:20},{m:'Set/23',n:23},{m:'Out/23',n:33},{m:'Nov/23',n:30},{m:'Dez/23',n:33},
  {m:'Jan/24',n:32},{m:'Fev/24',n:29},{m:'Mar/24',n:39},{m:'Abr/24',n:34},{m:'Mai/24',n:34},{m:'Jun/24',n:26},
  {m:'Jul/24',n:25},{m:'Ago/24',n:33},{m:'Set/24',n:24},{m:'Out/24',n:36},{m:'Nov/24',n:28},{m:'Dez/24',n:31},
];

const ufPremium = [
  {uf:'SC',v:282.28},{uf:'RJ',v:280.32},{uf:'MG',v:274.25},{uf:'PE',v:264.38},
  {uf:'SP',v:263.92},{uf:'RS',v:263.48},{uf:'PR',v:256.69},{uf:'BA',v:247.91},
];

const tipoSinistro = [
  {tipo:'Colisão',n:429},{tipo:'Roubo',n:168},{tipo:'Evento climático',n:154},
  {tipo:'Queda de objeto',n:124},{tipo:'Sem sinistro',n:86},{tipo:'Incêndio',n:39},
];

const logitData = [
  { name: 'Idade do Segurado', coef: -0.0010, p: 0.920, odds: 0.999 },
  { name: 'Sexo Masculino', coef: 0.3722, p: 0.105, odds: 1.451 },
  { name: 'Anos de Carteira', coef: 0.0235, p: 0.163, odds: 1.024 },
  { name: 'Sinistros Prévios', coef: -0.0559, p: 0.577, odds: 0.946 },
  { name: 'Multas Prévias', coef: -0.0278, p: 0.828, odds: 0.973 },
];

const poissonData = [
  { name: 'Idade do Segurado', coef: -0.0006, p: 0.797, irr: 0.999 },
  { name: 'Sexo Masculino', coef: -0.1038, p: 0.078, irr: 0.901 },
  { name: 'Anos de Carteira', coef: -0.0041, p: 0.283, irr: 0.996 },
  { name: 'Zona Rural', coef: -0.0352, p: 0.621, irr: 0.965 },
  { name: 'Multas Prévias', coef: -0.0274, p: 0.406, irr: 0.973 },
];

const mqoData = [
  { name: 'Idade do Segurado', coef: 0.6030, p: 0.037 },
  { name: 'Sexo Masculino', coef: 5.3503, p: 0.449 },
  { name: 'Anos de Carteira', coef: 0.9268, p: 0.034 },
  { name: 'Valor do Veículo', coef: -0.0001, p: 0.737 },
  { name: 'Sinistros Prévios', coef: -3.0154, p: 0.326 },
  { name: 'Multas Prévias', coef: -7.3622, p: 0.055 },
  { name: 'Zona Rural', coef: 0.8116, p: 0.922 },
  { name: 'Cobertura Full', coef: -2.4467, p: 0.766 },
  { name: 'Cobertura Terceiros', coef: -10.7858, p: 0.179 },
];

const tobitData = [
  { name: 'Intercepto', coef: 16039.55, p: 0.0001 },
  { name: 'Idade do Segurado', coef: -12.45, p: 0.704 },
  { name: 'Sexo Masculino', coef: -11.85, p: 0.988 },
  { name: 'Anos de Carteira', coef: 14.76, p: 0.765 },
  { name: 'Valor do Veículo', coef: -0.0154, p: 0.474 },
  { name: 'Zona Rural', coef: 12.72, p: 0.989 },
];

function sigLabel(p) {
  if (p < 0.01) return { s: '***', c: C.green };
  if (p < 0.05) return { s: '**', c: C.green };
  if (p < 0.10) return { s: '*', c: C.yellow };
  return { s: 'n.s.', c: C.sub };
}

// ---------- SHARED UI ----------
function Card({ children, style }) {
  return (
    <div style={{
      background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14,
      padding: '20px 22px', ...style
    }}>{children}</div>
  );
}

function KPI({ label, value, sub, accent }) {
  return (
    <Card style={{ flex: 1, minWidth: 0 }}>
      <div style={{ color: C.sub, fontSize: 12, fontFamily: fonts.body, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
      <div style={{ color: accent || C.text, fontSize: 30, fontFamily: fonts.display, fontWeight: 700, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ color: C.sub, fontSize: 12.5, marginTop: 8, fontFamily: fonts.body }}>{sub}</div>}
    </Card>
  );
}

function SigBadge({ p }) {
  const { s, c } = sigLabel(p);
  return (
    <span style={{
      fontFamily: fonts.mono, fontSize: 12, fontWeight: 700, color: c,
      background: c === C.sub ? '#22252A' : `${c}1A`, padding: '3px 9px',
      borderRadius: 6, border: `1px solid ${c === C.sub ? C.border : c + '40'}`
    }}>{s}</span>
  );
}

function CoefRow({ name, coef, p, fmt, extra }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: extra ? '1.6fr 1fr 1fr 0.8fr' : '1.8fr 1fr 0.8fr',
      alignItems: 'center', padding: '13px 4px', borderBottom: `1px solid ${C.border}`, gap: 10
    }}>
      <div style={{ fontFamily: fonts.body, fontSize: 14, color: C.text }}>{name}</div>
      <div style={{ fontFamily: fonts.mono, fontSize: 14, color: coef < 0 ? C.accent2 : C.blue, textAlign: 'right' }}>
        {fmt ? fmt(coef) : coef.toFixed(4)}
      </div>
      {extra && <div style={{ fontFamily: fonts.mono, fontSize: 14, color: C.sub, textAlign: 'right' }}>{extra(coef)}</div>}
      <div style={{ textAlign: 'right' }}><SigBadge p={p} /></div>
    </div>
  );
}

function SectionLabel({ eyebrow, title, desc }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ color: C.accent, fontFamily: fonts.mono, fontSize: 12.5, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>{eyebrow}</div>
      <div style={{ color: C.text, fontFamily: fonts.display, fontSize: 25, fontWeight: 700, marginBottom: 6 }}>{title}</div>
      {desc && <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 14, maxWidth: 720, lineHeight: 1.55 }}>{desc}</div>}
    </div>
  );
}

function GlobalStat({ label, value, valColor }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase', letterSpacing: 0.3 }}>{label}</span>
      <span style={{ color: valColor || C.text, fontSize: 17, fontFamily: fonts.mono, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function VerdictBanner({ verdict, text }) {
  const positive = verdict === 'confirma';
  const color = positive ? C.green : C.sub;
  return (
    <div style={{
      display: 'flex', gap: 14, alignItems: 'flex-start', background: positive ? `${C.green}0D` : '#1A1C20',
      border: `1px solid ${positive ? C.green + '33' : C.border}`, borderRadius: 12, padding: '16px 18px', marginTop: 18
    }}>
      <div style={{
        fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, color, border: `1px solid ${color}55`,
        borderRadius: 6, padding: '4px 8px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5
      }}>{positive ? 'Modelo validado' : 'Sem efeito significante'}</div>
      <div style={{ color: C.text, fontSize: 13.5, fontFamily: fonts.body, lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

// ---------- SCREENS ----------
function ScreenOverview() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ color: C.accent, fontFamily: fonts.mono, fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
          Portfólio de Análise de Dados · Seguros Automotivos
        </div>
        <div style={{ color: C.text, fontFamily: fonts.display, fontSize: 38, fontWeight: 700, lineHeight: 1.15, maxWidth: 780 }}>
          O preço justo de um risco<br />nem sempre é o que parece.
        </div>
        <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 15, lineHeight: 1.7, maxWidth: 680, marginTop: 16 }}>
          Este painel investiga, com métodos econométricos, se o mercado de seguros automotivos
          precifica corretamente o risco — ou se prêmios e sinistros escondem padrões que a
          intuição não capta. A base simula 1.000 apólices entre 2022 e 2024, e cada tela a seguir
          testa uma hipótese diferente sobre esse mercado.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <KPI label="Apólices Analisadas" value="1.000" sub="Período: Jan/2022 – Dez/2024" />
        <KPI label="Taxa de Sinistro" value="91,4%" sub="Apenas 8,6% sem ocorrência" accent={C.accent} />
        <KPI label="Prêmio Médio" value="R$ 267,51" sub="Faixa: R$ 80 – R$ 450 / mês" />
        <KPI label="Indenização Média" value="R$ 16.615" sub="Entre os sinistros pagos" accent={C.blue} />
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <Card style={{ flex: 1.4 }}>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Volume mensal de sinistros</div>
          <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 12.5, marginBottom: 14 }}>jan/2022 — dez/2024</div>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={monthlySeries} margin={{ left: -20, right: 10 }}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="m" tick={{ fill: C.sub, fontSize: 10, fontFamily: fonts.mono }} interval={3} axisLine={{ stroke: C.border }} tickLine={false} />
              <YAxis tick={{ fill: C.sub, fontSize: 10, fontFamily: fonts.mono }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: fonts.body, fontSize: 12 }} labelStyle={{ color: C.text }} />
              <Line type="monotone" dataKey="n" stroke={C.accent} strokeWidth={2.5} dot={false} name="Sinistros" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Tipos de sinistro</div>
          <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 12.5, marginBottom: 14 }}>distribuição (n=1.000)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 6 }}>
            {tipoSinistro.map(t => (
              <div key={t.tipo} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 100, fontSize: 12, color: C.sub, fontFamily: fonts.body }}>{t.tipo}</div>
                <div style={{ flex: 1, background: C.panel2, borderRadius: 5, height: 9, overflow: 'hidden' }}>
                  <div style={{ width: `${(t.n / 429) * 100}%`, height: '100%', background: t.tipo === 'Sem sinistro' ? C.green : C.accent, borderRadius: 5 }} />
                </div>
                <div style={{ width: 32, textAlign: 'right', fontSize: 12, color: C.text, fontFamily: fonts.mono }}>{t.n}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: 16 }}>
        <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Roteiro de investigação</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {[
            { n: '01', t: 'Probabilidade', d: 'Quem tem mais chance de sinistro?' },
            { n: '02', t: 'Frequência', d: 'Quantos sinistros um perfil acumula?' },
            { n: '03', t: 'Preço', d: 'O que determina o prêmio pago?' },
            { n: '04', t: 'Indenização', d: 'Quanto a seguradora paga, e a quem?' },
            { n: '05', t: 'Equidade', d: 'O preço discrimina por perfil?' },
            { n: '06', t: 'Tempo', d: 'O risco tem tendência ou sazonalidade?' },
          ].map(s => (
            <div key={s.n} style={{ borderLeft: `2px solid ${C.accent}`, paddingLeft: 12 }}>
              <div style={{ fontFamily: fonts.mono, color: C.accent, fontSize: 11 }}>{s.n}</div>
              <div style={{ fontFamily: fonts.body, color: C.text, fontSize: 13, fontWeight: 600, marginTop: 4 }}>{s.t}</div>
              <div style={{ fontFamily: fonts.body, color: C.sub, fontSize: 11.5, marginTop: 3, lineHeight: 1.4 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ScreenLogit() {
  return (
    <div>
      <SectionLabel eyebrow="Teste 01 · Regressão Logística" title="Quem tem mais chance de sofrer um sinistro?"
        desc="Modelamos a probabilidade de ocorrência de sinistro (sim/não) em função do perfil do segurado: idade, sexo, experiência, histórico de sinistros e multas." />

      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <GlobalStatCard label="Pseudo R² (McFadden)" value="0,0092" desc="poder explicativo do modelo" />
        <GlobalStatCard label="LLR p-valor" value="0,373" desc="significância conjunta do modelo" color={C.sub} />
        <GlobalStatCard label="Observações" value="1.000" desc="apólices no modelo" />
      </div>

      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 0.8fr', padding: '0 4px 10px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase' }}>Variável</div>
          <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase', textAlign: 'right' }}>Coeficiente</div>
          <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase', textAlign: 'right' }}>Sig.</div>
        </div>
        {logitData.map(d => <CoefRow key={d.name} {...d} />)}
        <VerdictBanner verdict="nenhum" text={
          <>Nenhuma variável é significante a 10%. O teste de razão de verossimilhança (LLR) também não rejeita H₀ — ou seja, o conjunto de variáveis, em bloco, não explica a ocorrência de sinistro melhor que o acaso. Sob os dados simulados, <b style={{color:C.text}}>não há perfil de risco identificável</b> com essas covariáveis.</>
        } />
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Nota metodológica</div>
        <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 13, lineHeight: 1.6 }}>
          A variável <code style={{ color: C.accent2, fontFamily: fonts.mono }}>Zona_Rural</code> foi excluída desta especificação por apresentar
          separação quase perfeita com a variável dependente (100% dos casos rurais simulados tiveram sinistro), o que impede a
          convergência da estimativa por máxima verossimilhança — um problema técnico clássico em amostras pequenas ou desbalanceadas.
        </div>
      </Card>
    </div>
  );
}

function ScreenPoisson() {
  return (
    <div>
      <SectionLabel eyebrow="Teste 02 · Regressão de Poisson" title="Quantos sinistros um perfil acumula?"
        desc="Diferente do teste anterior (sim/não), aqui modelamos a contagem de sinistros prévios — quantas vezes, no histórico, aquele segurado já acionou o seguro." />

      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <GlobalStatCard label="Pseudo R²" value="0,0019" desc="poder explicativo do modelo" />
        <GlobalStatCard label="Razão Var/Média" value="0,982" desc="teste de overdispersion" color={C.green} />
        <GlobalStatCard label="LLR p-valor" value="0,365" desc="significância conjunta" color={C.sub} />
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <Card style={{ flex: 1.3 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.9fr 0.9fr 0.7fr', padding: '0 4px 10px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase' }}>Variável</div>
            <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase', textAlign: 'right' }}>Coef.</div>
            <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase', textAlign: 'right' }}>IRR</div>
            <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase', textAlign: 'right' }}>Sig.</div>
          </div>
          {poissonData.map(d => <CoefRow key={d.name} {...d} extra={() => d.irr.toFixed(3)} />)}
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Teste de Overdispersion</div>
          <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 12.5, lineHeight: 1.6, marginBottom: 16 }}>
            Compara a variância com a média da contagem de sinistros. Se a razão for muito maior que 1, o modelo de Poisson subestima o erro-padrão e a Binomial Negativa seria preferível.
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: fonts.display, fontSize: 32, fontWeight: 700, color: C.green }}>0,98</span>
            <span style={{ fontFamily: fonts.body, fontSize: 12, color: C.sub }}>var / média</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: C.green, fontFamily: fonts.body }}>✓ Equidispersão confirmada — Poisson é a especificação correta</div>
        </Card>
      </div>

      <VerdictBanner verdict="nenhum" text={
        <>Sexo Masculino chega perto da significância (p=0,078, IRR=0,90), sugerindo levemente <b style={{color:C.text}}>menos</b> sinistros prévios entre homens nesta amostra — mas não cruza o limiar de 5%. Como esperado em dados simulados aleatoriamente, o modelo não encontra um determinante robusto da frequência de sinistros.</>
      } />
    </div>
  );
}

function ScreenMQO() {
  return (
    <div>
      <SectionLabel eyebrow="Teste 03 · Regressão Linear Múltipla (MQO)" title="O que determina o prêmio mensal pago?"
        desc="Regredimos o valor do prêmio sobre as características do segurado, do veículo e do contrato — e testamos a robustez do modelo com três diagnósticos clássicos." />

      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <GlobalStatCard label="R²" value="0,016" desc="variância explicada (bruta)" />
        <GlobalStatCard label="R² Ajustado" value="0,007" desc="penalizado por nº de variáveis" color={C.sub} />
        <GlobalStatCard label="Teste F (p-valor)" value="0,068" desc="significância conjunta" color={C.yellow} />
      </div>

      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 0.8fr', padding: '0 4px 10px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase' }}>Variável</div>
          <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase', textAlign: 'right' }}>Coeficiente</div>
          <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase', textAlign: 'right' }}>Sig.</div>
        </div>
        {mqoData.map(d => <CoefRow key={d.name} {...d} fmt={v => v.toFixed(4)} />)}
      </Card>

      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <DiagCard title="Breusch-Pagan" subtitle="Heterocedasticidade" stat="LM = 8,13 · p = 0,521" verdict="OK" desc="Resíduos homocedásticos — variância do erro constante." color={C.green} />
        <DiagCard title="Jarque-Bera" subtitle="Normalidade dos resíduos" stat="JB = 56,35 · p < 0,001" verdict="ATENÇÃO" desc="Resíduos não normais — esperado, pois o prêmio foi gerado por distribuição uniforme." color={C.accent} />
        <DiagCard title="VIF Máximo" subtitle="Multicolinearidade" stat="VIF = 1,01" verdict="OK" desc="Sem colinearidade relevante entre regressores." color={C.green} />
      </div>

      <VerdictBanner verdict="nenhum" text={
        <>Idade e Anos de Carteira aparecem "significantes" a 5% isoladamente, mas o R² ajustado é de apenas 0,7% e o teste F global não rejeita H₀ a 5% (p=0,068) — um alerta clássico de <b style={{color:C.text}}>comparações múltiplas</b>: testar muitas variáveis aumenta a chance de achar uma "significante" por acaso.</>
      } />
    </div>
  );
}

function ScreenTobit() {
  return (
    <div>
      <SectionLabel eyebrow="Teste 04 · Modelo Tobit" title="Quanto a seguradora paga — e a quem?"
        desc="O valor indenizado tem uma massa de zeros (8,6% dos segurados não tiveram sinistro). O Tobit trata essa censura corretamente via máxima verossimilhança." />

      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <GlobalStatCard label="Censura (zeros)" value="8,6%" desc="apólices sem indenização" color={C.blue} />
        <GlobalStatCard label="Sigma (σ)" value="R$ 11.918" desc="desvio-padrão do erro latente" />
        <GlobalStatCard label="Log-Likelihood" value="-9.975,3" desc="ajuste do modelo" color={C.sub} />
      </div>

      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 0.8fr', padding: '0 4px 10px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase' }}>Variável</div>
          <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase', textAlign: 'right' }}>Coeficiente (R$)</div>
          <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase', textAlign: 'right' }}>Sig.</div>
        </div>
        {tobitData.map(d => <CoefRow key={d.name} {...d} fmt={v => v.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2})} />)}
        <VerdictBanner verdict={tobitData[0].p < 0.01 ? 'confirma' : 'nenhum'} text={
          <>Apenas o <b style={{color:C.text}}>intercepto</b> é altamente significante (p&lt;0,001), capturando o nível médio de indenização (~R$16 mil) quando há sinistro. Nenhuma covariável explica variação adicional — coerente com a geração aleatória do valor na base simulada. O ponto-chave aqui é técnico: o modelo trata corretamente a censura à esquerda, essencial sempre que uma fração relevante da amostra não sofre o evento.</>
        } />
      </Card>
    </div>
  );
}

function ScreenDiscriminacao() {
  return (
    <div>
      <SectionLabel eyebrow="Teste 05 · Discriminação no Pricing" title="O preço cobrado discrimina por perfil?"
        desc="Comparamos prêmios médios entre grupos (sexo, estado) e testamos se essas diferenças persistem mesmo controlando pelo risco objetivo do segurado." />

      <div style={{ display: 'flex', gap: 16 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Teste t — Prêmio médio por sexo</div>
          <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
            <BigStat label="Masculino" value="R$ 269,54" />
            <BigStat label="Feminino" value="R$ 263,70" />
          </div>
          <StatLine label="Estatística t" value="0,826" />
          <StatLine label="p-valor" value="0,409" badge />
          <div style={{ marginTop: 12, fontSize: 12.5, color: C.sub, fontFamily: fonts.body, lineHeight: 1.55 }}>
            Diferença não significante — sem evidência de discriminação de preço por sexo.
          </div>
        </Card>

        <Card style={{ flex: 1.4 }}>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 4 }}>ANOVA — Prêmio médio por estado (UF)</div>
          <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 12, marginBottom: 14 }}>F = 1,393 · p = 0,205 (não significante)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ufPremium} margin={{ left: -20, right: 10 }}>
              <CartesianGrid stroke={C.border} vertical={false} />
              <XAxis dataKey="uf" tick={{ fill: C.sub, fontSize: 11, fontFamily: fonts.mono }} axisLine={{ stroke: C.border }} tickLine={false} />
              <YAxis tick={{ fill: C.sub, fontSize: 10, fontFamily: fonts.mono }} axisLine={false} tickLine={false} domain={[200, 300]} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: fonts.body, fontSize: 12 }} labelStyle={{ color: C.text }} />
              <Bar dataKey="v" radius={[5, 5, 0, 0]}>
                {ufPremium.map((e, i) => <Cell key={i} fill={i === 0 ? C.accent : C.panel2} stroke={C.border} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card style={{ marginTop: 16 }}>
        <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Regressão com controle de risco</div>
        <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 13, lineHeight: 1.65, marginBottom: 12 }}>
          Ao regredir o prêmio sobre sexo, controlando por sinistros prévios, multas, idade e anos de carteira,
          o coeficiente de <code style={{ color: C.accent2, fontFamily: fonts.mono }}>Sexo Masculino</code> permanece não significante:
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          <StatLine label="Coeficiente" value="+R$ 5,43" />
          <StatLine label="p-valor" value="0,441" badge />
        </div>
        <VerdictBanner verdict="confirma" text={
          <>Não há evidência de discriminação residual de pricing por sexo, mesmo após controlar pelo risco observável (sinistros e multas prévias) — o resultado é <b style={{color:C.text}}>consistente</b> entre o teste simples e o controlado.</>
        } />
      </Card>
    </div>
  );
}

function ScreenSerieTemporal() {
  return (
    <div>
      <SectionLabel eyebrow="Teste 06 · Série Temporal" title="O risco tem tendência ou sazonalidade?"
        desc="Agregamos os sinistros por mês (36 observações) e testamos estacionariedade com o teste Augmented Dickey-Fuller (ADF), além de decompor a série em tendência, sazonalidade e ruído." />

      <Card style={{ marginBottom: 16 }}>
        <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Sinistros por mês — Jan/2022 a Dez/2024</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlySeries} margin={{ left: -20, right: 10, top: 10 }}>
            <CartesianGrid stroke={C.border} vertical={false} />
            <XAxis dataKey="m" tick={{ fill: C.sub, fontSize: 10, fontFamily: fonts.mono }} interval={2} axisLine={{ stroke: C.border }} tickLine={false} />
            <YAxis tick={{ fill: C.sub, fontSize: 10, fontFamily: fonts.mono }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, fontFamily: fonts.body, fontSize: 12 }} labelStyle={{ color: C.text }} />
            <Line type="monotone" dataKey="n" stroke={C.accent} strokeWidth={2.5} dot={{ r: 2.5, fill: C.accent }} name="Sinistros" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Card style={{ flex: 1 }}>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Teste ADF — Nº de Sinistros</div>
          <StatLine label="Estatística ADF" value="-1,633" />
          <StatLine label="p-valor" value="0,466" badge />
          <div style={{ marginTop: 12, fontSize: 12.5, color: C.sub, fontFamily: fonts.body, lineHeight: 1.55 }}>
            Não rejeita H₀ de raiz unitária — série não é estacionária em nível.
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Teste ADF — Valor Indenizado</div>
          <StatLine label="Estatística ADF" value="-2,372" />
          <StatLine label="p-valor" value="0,150" badge />
          <div style={{ marginTop: 12, fontSize: 12.5, color: C.sub, fontFamily: fonts.body, lineHeight: 1.55 }}>
            Mesmo padrão — recomenda-se diferenciação (d=1) para modelagem ARIMA.
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Decomposição sazonal</div>
          <StatLine label="Var. Tendência" value="8,68" />
          <StatLine label="Var. Sazonal" value="6,88" />
          <StatLine label="Var. Resíduo" value="7,12" />
        </Card>
      </div>

      <VerdictBanner verdict="nenhum" text={
        <>As duas séries não são estacionárias em nível (p&gt;0,05 no teste ADF) — esperado em séries curtas (36 meses). A queda de volume observada entre 2022 (~30/mês) e o início de 2023 (~23/mês), seguida de recuperação em 2024, sugere uma <b style={{color:C.text}}>tendência</b>, não apenas ruído. Para causalidade de Granger ou ARIMA robustos, recomenda-se ampliar o histórico.</>
      } />
    </div>
  );
}

// ---------- Small helpers ----------
function GlobalStatCard({ label, value, desc, color }) {
  return (
    <Card style={{ flex: 1 }}>
      <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 8 }}>{label}</div>
      <div style={{ color: color || C.text, fontSize: 24, fontFamily: fonts.mono, fontWeight: 700 }}>{value}</div>
      <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, marginTop: 6 }}>{desc}</div>
    </Card>
  );
}

function DiagCard({ title, subtitle, stat, verdict, desc, color }) {
  return (
    <Card style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ color: C.text, fontFamily: fonts.body, fontWeight: 600, fontSize: 13.5 }}>{title}</div>
          <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 11.5 }}>{subtitle}</div>
        </div>
        <span style={{ fontFamily: fonts.mono, fontSize: 10.5, fontWeight: 700, color, border: `1px solid ${color}55`, borderRadius: 6, padding: '3px 7px' }}>{verdict}</span>
      </div>
      <div style={{ color: C.text, fontFamily: fonts.mono, fontSize: 13, marginBottom: 8 }}>{stat}</div>
      <div style={{ color: C.sub, fontFamily: fonts.body, fontSize: 12, lineHeight: 1.5 }}>{desc}</div>
    </Card>
  );
}

function BigStat({ label, value }) {
  return (
    <div>
      <div style={{ color: C.sub, fontSize: 11.5, fontFamily: fonts.body, marginBottom: 4 }}>{label}</div>
      <div style={{ color: C.text, fontSize: 22, fontFamily: fonts.display, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function StatLine({ label, value, badge }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0' }}>
      <span style={{ color: C.sub, fontSize: 12.5, fontFamily: fonts.body }}>{label}</span>
      <span style={{
        color: badge ? C.sub : C.text, fontFamily: fonts.mono, fontSize: 13.5, fontWeight: 700,
        background: badge ? '#22252A' : 'transparent', padding: badge ? '2px 8px' : 0, borderRadius: 6
      }}>{value}</span>
    </div>
  );
}

// ---------- MAIN APP ----------
const SCREENS = [
  { id: 'overview', label: 'Visão Geral', num: '00', comp: ScreenOverview },
  { id: 'logit', label: 'Probabilidade (Logit)', num: '01', comp: ScreenLogit },
  { id: 'poisson', label: 'Frequência (Poisson)', num: '02', comp: ScreenPoisson },
  { id: 'mqo', label: 'Pricing (MQO)', num: '03', comp: ScreenMQO },
  { id: 'tobit', label: 'Indenização (Tobit)', num: '04', comp: ScreenTobit },
  { id: 'discriminacao', label: 'Equidade no Preço', num: '05', comp: ScreenDiscriminacao },
  { id: 'serie', label: 'Série Temporal', num: '06', comp: ScreenSerieTemporal },
];

export default function App() {
  const [active, setActive] = useState('overview');
  const ActiveComp = SCREENS.find(s => s.id === active).comp;

  return (
    <div style={{
      display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: fonts.body,
      color: C.text
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #2A2D32; border-radius: 4px; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{
        width: 240, background: C.panel, borderRight: `1px solid ${C.border}`,
        padding: '24px 16px', display: 'flex', flexDirection: 'column', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 30 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 15, color: '#0B0C0E' }}>β</span>
          </div>
          <div>
            <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 14.5, color: C.text }}>RiskMetrics</div>
            <div style={{ fontFamily: fonts.body, fontSize: 10.5, color: C.sub }}>Econometria de Seguros</div>
          </div>
        </div>

        <div style={{ color: C.sub, fontSize: 10.5, fontFamily: fonts.body, textTransform: 'uppercase', letterSpacing: 0.6, padding: '0 8px', marginBottom: 10 }}>
          Navegação
        </div>

        {SCREENS.map(s => {
          const isActive = s.id === active;
          return (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px',
              background: isActive ? C.panel2 : 'transparent', border: 'none',
              borderLeft: isActive ? `2px solid ${C.accent}` : '2px solid transparent',
              borderRadius: 8, cursor: 'pointer', textAlign: 'left', marginBottom: 2, width: '100%'
            }}>
              <span style={{ fontFamily: fonts.mono, fontSize: 11, color: isActive ? C.accent : C.sub, width: 18 }}>{s.num}</span>
              <span style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? C.text : C.sub }}>{s.label}</span>
            </button>
          );
        })}

        <div style={{ flex: 1 }} />
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, padding: '14px 8px 0' }}>
          <div style={{ color: C.sub, fontSize: 11, fontFamily: fonts.body, lineHeight: 1.6 }}>
            Base fictícia · 1.000 apólices<br />Período 2022–2024
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '32px 36px', overflowY: 'auto', maxHeight: '100vh' }}>
        <ActiveComp />
      </div>
    </div>
  );
}
