export async function fetchItems() {
  const response = await fetch('http://localhost:3000/api/items');
  const result = await response.json();
  return result.data;
}

export async function fetchItemByEntry(entry) {
  const response = await fetch(`http://localhost:3000/api/items/${entry}`);
  const result = await response.json();
  return result.data;
}

export async function fetchAuctions() {
  const response = await fetch('http://localhost:3000/api/auctions');
  const result = await response.json();
  return result.data;
}

export async function fetchAuctionByEntry(entry) {
  const response = await fetch(`http://localhost:3000/api/auctions/${entry}`);
  const result = await response.json();
  return result.data;
}
