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
    const { image } = await req.json();
    
    if (!image) {
      throw new Error('Imagem não fornecida');
    }

    console.log('Iniciando análise de deck...');

    // Step 1: Use Google Vision API to detect text/labels in the image
    const GOOGLE_VISION_API_KEY = Deno.env.get('GOOGLE_VISION_API_KEY');
    if (!GOOGLE_VISION_API_KEY) {
      throw new Error('GOOGLE_VISION_API_KEY não configurada');
    }

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              image: { content: base64Image },
              features: [
                { type: 'TEXT_DETECTION', maxResults: 10 },
                { type: 'LABEL_DETECTION', maxResults: 10 }
              ]
            }
          ]
        })
      }
    );

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.error('Google Vision API error:', errorText);
      throw new Error('Erro ao analisar imagem com Google Vision');
    }

    const visionData = await visionResponse.json();
    console.log('Vision API response:', JSON.stringify(visionData, null, 2));

    // Extract detected text and labels
    const detectedText = visionData.responses?.[0]?.textAnnotations?.[0]?.description || '';
    const labels = visionData.responses?.[0]?.labelAnnotations?.map((l: any) => l.description) || [];
    
    console.log('Texto detectado:', detectedText);
    console.log('Labels detectadas:', labels);

    // Step 2: Use Lovable AI to analyze and generate counter deck
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    const aiPrompt = `Você é a Clash IA, especialista em Clash Royale.

Analise as seguintes informações extraídas de uma imagem de deck:
- Texto detectado: ${detectedText}
- Labels: ${labels.join(', ')}

Com base nessas informações:
1. Identifique as 8 cartas do deck inimigo (se não conseguir identificar todas, use as cartas mais prováveis baseado no contexto de Clash Royale)
2. Crie o melhor deck counter possível (8 cartas)
3. Para cada carta do counter, explique:
   - Qual(is) carta(s) do deck inimigo ela neutraliza
   - Por que foi escolhida
   - Como e quando usar

Responda APENAS com um JSON válido neste formato:
{
  "enemyDeck": [
    {"name": "Nome da Carta", "icon": "emoji"}
  ],
  "counterDeck": [
    {
      "name": "Nome da Carta",
      "icon": "emoji",
      "role": "Papel (ex: Tanque, Suporte)",
      "explanation": "Explicação detalhada",
      "counters": ["Carta Inimiga 1", "Carta Inimiga 2"]
    }
  ],
  "counterName": "Nome épico do deck counter",
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
