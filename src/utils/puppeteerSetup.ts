import puppeteer from 'puppeteer'
import { __puppeteer_slowmotion_ms_time__ } from '../constants'

export const instantiateBrowserAndPage = async () => {
  const chromeOptions: puppeteer.LaunchOptions = {
    headless: false,
    slowMo: __puppeteer_slowmotion_ms_time__,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }

  const browser = await puppeteer.launch(chromeOptions)
  const page = await browser.newPage()
  return { browser, page }
}
