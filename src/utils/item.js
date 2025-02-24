export function getIcon(icon) {
  return `/src/assets/icons/${icon}.png`;
}

export function formatPrice(totalCopper) {
  const gold = Math.floor(totalCopper / 10000);
  const silver = Math.floor((totalCopper % 10000) / 100);
  const copper = totalCopper % 100;
  let formatted = '';
  if (gold > 0) {
    formatted += `${gold}<img src="/src/assets/images/money-gold.gif" alt="Gold" class="inline w-3 h-3 ml-1"> `;
  }
  if (silver > 0 || gold > 0) {
    formatted += `${silver}<img src="/src/assets/images/money-silver.gif" alt="Silver" class="inline w-3 h-3 ml-1"> `;
  }
  formatted += `${copper}<img src="/src/assets/images/money-copper.gif" alt="Copper" class="inline w-3 h-3 ml-1">`;
  return formatted;
}