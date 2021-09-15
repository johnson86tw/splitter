export const urlParams = new URLSearchParams(window.location.search)

export function updateChainId(chainId: number) {
  urlParams.set('chainId', chainId.toString())
  window.history.replaceState({}, '', `${location.pathname}?${urlParams}`)
}
