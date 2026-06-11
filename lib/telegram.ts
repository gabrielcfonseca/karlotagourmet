import type { Order } from './orders'

const SITE = 'https://karlotagourmet.com'

function chatIds(): string[] {
  return (process.env.TELEGRAM_CHAT_IDS ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

/**
 * Sends a new-order notification to every configured Telegram chat,
 * with inline Approve / Reject buttons that open the order action pages.
 */
export async function sendOrderTelegram(order: Order): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const ids = chatIds()
  if (!token || ids.length === 0) return

  const itemsText = order.items
    .map(i => `• ${i.qty}× ${i.name} — $${(i.price * i.qty).toFixed(2)}`)
    .join('\n')

  const typeLabel = order.delivery.type === 'delivery' ? '🚗 Delivery' : '🛍️ Pickup'
  const addressLine = order.delivery.type === 'delivery' ? `\n📍 ${order.delivery.address}` : ''

  const text =
`🍽️ *New Order* #${order.id.slice(-6).toUpperCase()}

👤 *${order.customer.name}*
📧 ${order.customer.email}
📱 ${order.customer.phone}

${typeLabel}${addressLine}
📅 ${order.delivery.date} at ${order.delivery.time}

*Items:*
${itemsText}

Subtotal: $${order.subtotal.toFixed(2)}
Tax: $${order.tax.toFixed(2)}${order.deliveryFee > 0 ? `\nDelivery: $${order.deliveryFee.toFixed(2)}` : ''}
*TOTAL: $${order.total.toFixed(2)}*`

  const approveUrl = `${SITE}/api/orders/${order.id}/approve?token=${order.approvalToken}`
  const rejectUrl = `${SITE}/api/orders/${order.id}/reject?token=${order.approvalToken}`

  const reply_markup = {
    inline_keyboard: [[
      { text: '✅ Approve', url: approveUrl },
      { text: '❌ Reject', url: rejectUrl },
    ]],
  }

  await Promise.all(
    ids.map(chat_id =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text, parse_mode: 'Markdown', reply_markup }),
      }).catch(err => console.error('Telegram send error:', err))
    )
  )
}
