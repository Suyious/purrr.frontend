import { Kalnia, Lato, Playfair_Display } from "next/font/google";

export const kalnia = Kalnia({ subsets: ['latin'], variable: "--font-kalnia" })
export const lato = Lato({ weight: ["100", "300","400","700"], subsets: ["latin"], variable: "--font-lato"})
export const playfair_display = Playfair_Display({ weight: ["400"], style: ["italic"], subsets: ["latin"], variable: "--font-playfair-display"})