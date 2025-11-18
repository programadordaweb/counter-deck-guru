import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, deckText, arena, isPremium } = await req.json();
    
    if (!image && !deckText) {
      throw new Error('Imagem ou texto não fornecidos');
    }

    console.log('Iniciando análise de deck...', { arena, isPremium });
    
    // Verificar se é premium quando tenta usar imagem
    if (image && !isPremium) {
      return new Response(
        JSON.stringify({ error: 'Upload de imagens é exclusivo para Premium' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }
    
    // Usando dados mock temporários (Google Vision API será integrada posteriormente)
    console.log('Usando análise mock - API do Google Vision será integrada em breve');
    
    let detectedText = 'Deck do oponente com cartas populares do meta';
    const labels = ['game', 'mobile game', 'cards', 'strategy'];
    
    // Se o usuário digitou as cartas, use o texto fornecido
    if (deckText) {
      console.log('Usando texto fornecido pelo usuário:', deckText);
      detectedText = deckText;
    }

    // Step 2: Use Lovable AI to analyze and generate counter deck
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    const arenaContext = arena ? `\n\nARENA DO JOGADOR: Arena ${arena}
- Sugira APENAS cartas disponíveis até a Arena ${arena}
- Certifique-se de que todas as cartas counter estão desbloqueadas nesta arena` : '';
    
    const premiumContext = isPremium 
      ? '\n\nMODO PREMIUM: Forneça análise AVANÇADA com estratégias detalhadas, posicionamento específico e timings precisos.'
      : '\n\nMODO GRÁTIS: Forneça análise BÁSICA com explicações simples e diretas.';

    const aiPrompt = `Você é a Clash IA, especialista em Clash Royale com conhecimento profundo de TODAS as cartas do jogo.

INSTRUÇÕES DE IDENTIFICAÇÃO DE CARTAS:
- Analise cuidadosamente o texto detectado para identificar nomes de cartas
- Considere variações de escrita e abreviações comuns (ex: "Mega Knight", "MK", "Megacavaleiro")
- Preste atenção em números de nível e custo de elixir mencionados
- Use as labels visuais para identificar tipos de cartas (tropa, spell, building)
- Se houver ícones de custo de elixir, use-os para validar as cartas identificadas
- Cartas comuns do meta atual: Hog Rider, Megacavaleiro, P.E.K.K.A, Gigante, Balão, Megaesbirro, Valquíria, Eletrogigante, Porco Montado

Informações extraídas:
- Texto detectado: ${detectedText}
- Labels visuais: ${labels.join(', ')}${arenaContext}${premiumContext}

TAREFA:
1. Identifique as 8 cartas do deck inimigo com máxima precisão
   - Use APENAS cartas reais do Clash Royale
   - Se não conseguir identificar alguma carta com certeza, use cartas populares do meta baseando-se no contexto
   - Valide se as cartas fazem sentido juntas (sinergia de deck)

2. Crie o melhor deck counter possível (8 cartas)
   - IMPORTANTE: Use apenas cartas disponíveis na arena especificada
   - Considere custos de elixir balanceados
   - Inclua cartas que neutralizem múltiplas ameaças do deck inimigo
   - Garanta boa defesa E ataque

3. Para cada carta do counter, explique de forma detalhada e prática

Responda APENAS com um JSON válido neste formato exato:
{
  "enemyDeck": [
    {"name": "Nome da Carta", "icon": "emoji representativo"}
  ],
  "counterDeck": [
    {
      "name": "Nome da Carta",
      "icon": "emoji representativo",
      "role": "Papel no deck (ex: Tanque, Win Condition, Spell, Suporte, Defesa Aérea)",
      "explanation": "Explicação detalhada de uso, timing ideal e posicionamento",
      "counters": ["Carta Inimiga 1", "Carta Inimiga 2"]
    }
  ],
  "counterName": "Nome épico e criativo para o deck counter",
  "isAbsoluteCounter": true/false
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Você é um especialista em Clash Royale. Sempre responda com JSON válido.' },
          { role: 'user', content: aiPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', errorText);
      throw new Error('Erro ao gerar deck counter com IA');
    }

    const aiData = await aiResponse.json();
    console.log('AI response:', JSON.stringify(aiData, null, 2));

    let result;
    try {
      const content = aiData.choices?.[0]?.message?.content || '';
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      result = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      console.error('Conteúdo recebido:', aiData.choices?.[0]?.message?.content);
      throw new Error('Resposta da IA não está em formato JSON válido');
    }

    console.log('Deck counter gerado com sucesso');
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na função analyze-deck:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
