export async function sharePageLink({ title, text, url = window.location.href }) {
  const shareData = { title, text, url }

  if (navigator.share) {
    await navigator.share(shareData)
    return 'shared'
  }

  await navigator.clipboard.writeText(url)
  return 'copied'
}
