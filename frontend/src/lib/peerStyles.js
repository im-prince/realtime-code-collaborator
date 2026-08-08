const inks = {
  '#22D3EE': '#04202A',
  '#F472B6': '#22060F',
  '#A3E635': '#16240A',
  '#FBBF24': '#231502',
  '#A78BFA': '#170A2E',
  '#FB7185': '#2A0710',
};

let tag = null;

export function paintPeers(peers) {
  if (!tag) {
    tag = document.createElement('style');
    document.head.appendChild(tag);
  }

  tag.textContent = peers
    .filter((p) => !p.isMe)
    .map(
      (p) => `
      .yRemoteSelection-${p.id},
      .yRemoteSelectionHead-${p.id} {
        --peer: ${p.color};
        --peerInk: ${inks[p.color] || '#0B0C0E'};
      }
      .yRemoteSelectionHead-${p.id}::after {
        content: "${p.name.replace(/"/g, '')}";
      }`
    )
    .join('\n');
}