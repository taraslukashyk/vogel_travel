export async function translateText(text: string, from: 'uk' | 'en', to: 'uk' | 'en'): Promise<string> {
  if (!text.trim()) return '';

  console.log(`Translating from ${from} to ${to}: "${text.substring(0, 30)}..."`);

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Translation request failed with status:', response.status);
      throw new Error(`Translation request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Translation response received:', data);
    
    // Google Translate returns an array of segments
    if (data && data[0]) {
      const result = data[0].map((s: any) => s[0]).join('');
      console.log('Translated text:', result.substring(0, 30) + '...');
      return result;
    }
    
    return text;
  } catch (error) {
    console.error('Translation utility error:', error);
    return text;
  }
}
