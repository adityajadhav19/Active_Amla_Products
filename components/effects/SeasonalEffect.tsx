"use client"

import SnowEffect from "./SnowEffect"
import DiwaliEffect from "./DiwaliEffect"
import KiteEffect from "./KiteEffect"
import GudiPadwaEffect from "./GudiPadwaEffect"
import GaneshEffect from "./GaneshJiEffect"
import PatrioticEffect from "./patriotic"

export default function SeasonalEffects() {
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() // 0–11

  // 🇮🇳 Republic Day (26 Jan)
if (day === 26 && month === 0) {
  return <PatrioticEffect />
}

if (day === 15 && month === 7) {
  return <PatrioticEffect />
}

  // 🪁 Makar Sankranti / Kite season (Jan)
  if (month === 0) {
    return <KiteEffect />
  }

  // 🌿 Gudi Padwa (Mar–Apr)
  if (month === 2 || month === 3) {
    return <GudiPadwaEffect />
  }

  // 🪔 Ganesh Chaturthi (Aug–Sep)
  //if (month === 7 || month === 8) {
  //  return <GaneshEffect />
  //}

  // 🪔 Diwali (Oct–Nov)
  //if (month === 1 || month === 10) {
  //  return <DiwaliEffect />
  //}

  // ❄️ Winter / Christmas (Dec)
  if (month === 11) {
    return <SnowEffect />
  }

  return null
}
