#!/usr/bin/env node
/**
 * Generate sponsor logos using Gemini
 */

const fs = require('fs');
const path = require('path');

const sponsors = [
  { name: 'kwadro', prompt: 'KwadrO logo, green shield shape with white text "KwadrO" and smaller text "RAMEN & DEUREN" below, corporate logo on white background' },
  { name: 'schilderwerken-hermans', prompt: 'Schilderwerken Hermans logo, minimalist house icon with paint roller, text "SCHILDERWERKEN HERMANS" below with tagline "fijnschilder & renovatie", black on white background' },
  { name: 'groep-hendrickx', prompt: 'Groep Hendrickx logo, geometric H symbol in blue and yellow colors, text "GROEP HENDRICKX" in bold blue letters, corporate logo on white background' },
  { name: 'tom-feytons', prompt: 'Tom Feytons Bouwbedrijf logo, house outline with "TF" initials inside, text "TOM FEYTONS BOUWBEDRIJF" with location "Heers" and phone number, black line art on white background' },
  { name: 'mcb-events', prompt: 'MCB Events logo, microphone icon, text "MCB EVENTS" in bold with tagline "Music Comedy & More", black and yellow on white background' },
  { name: 'stevens-houttechniek', prompt: 'Stevens Houttechniek logo, circular saw blade icon in yellow, text "STEVENS HOUTTECHNIEK" in bold black letters, yellow and black on white background' },
  { name: 'fyto-vrancken', prompt: 'Fyto Vrancken logo, green leaf icon, text "FYTO" in green italics and "VRANCKEN" in dark green, agricultural company logo on white background' },
  { name: 'see-it', prompt: 'SEE-IT logo, 3D hexagonal cube icon, text "SEE-IT" in bold black letters, modern tech company logo on white background' },
  { name: 'advivo', prompt: 'Advivo Advocaten logo, text "Advivo" in elegant blue serif font with "Advocaten" below in smaller text, law firm logo on white background' },
  { name: 'joris', prompt: 'Joris logo, blue barn/silo building icon, text "Joris" in blue script font with tagline "GRANEN • VEEVOEDERS • MESTSTOFFEN", agricultural company logo on white background' },
  { name: 'drankenhandel-gos', prompt: 'Drankenhandel GOS logo, golden circular emblem with laurel wreath, crown on top, text "DRANKENHANDEL" at top and "GOS" in large letters with "HEERS" below, vintage style logo on white background' },
  { name: 'glowww', prompt: 'Glowww logo, modern blue "G" icon that curves into itself, text "glowww." in dark blue lowercase, tech company logo on white background' }
];

async function getApiKey() {
  const credPath = '/root/clawd/.credentials/gemini.json';
  if (fs.existsSync(credPath)) {
    const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    return creds.api_key || creds.apiKey;
  }
  throw new Error('No Gemini API key found');
}

async function generateImage(prompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Generate a clean professional logo image: ${prompt}` }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  
  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith('image/')) {
      return { data: part.inlineData.data, mimeType: part.inlineData.mimeType };
    }
  }
  
  throw new Error('No image in response');
}

async function main() {
  const apiKey = await getApiKey();
  const outputDir = path.join(__dirname, '../public/sponsors');
  
  for (const sponsor of sponsors) {
    console.log(`🎨 Generating: ${sponsor.name}...`);
    try {
      const image = await generateImage(sponsor.prompt, apiKey);
      const ext = image.mimeType === 'image/png' ? 'png' : 'jpg';
      const outputPath = path.join(outputDir, `${sponsor.name}.${ext}`);
      
      const buffer = Buffer.from(image.data, 'base64');
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`✅ Saved: ${sponsor.name}.${ext}`);
    } catch (error) {
      console.error(`❌ Failed ${sponsor.name}: ${error.message}`);
    }
    
    // Rate limit
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('\n✨ Done!');
}

main();
