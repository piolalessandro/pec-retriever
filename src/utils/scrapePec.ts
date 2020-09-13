import axios from 'axios'
import poll from 'promise-poller'
import { PersonType } from '../types/types'
import { sleep } from './sleep'
import { __puppeteer_slowmotion_ms_time__, __puppeteer_page_timeout_ms_time__ } from '../constants'
import { instantiateBrowserAndPage } from './puppeteerSetup'
import { initiateCaptchaRequest } from './captchaResolverSetup'

const websiteDetails = {
  sitekey: '6Lf-0UAUAAAAAHdt6Gc54MkKXzoyV1iMzX7L55V9',
  pageurl: 'https://www.inipec.gov.it/cerca-pec/-/pecs/',
  naturalTaxCodeInputField: '#_1_WAR_searchpecsportlet_tax-code',
  legalTaxCodeInputField: '#_1_WAR_searchpecsportlet_tax-code-vat',
  recaptchaInputField: 'g-recaptcha-response',
  submitButtonField: '.search-pecs-search-button[type=submit]',
}

const pollForRequestResults = async (
  apiKey: string,
  requestId: string,
  retries = 30,
  interval = 1500,
  delay = 15000
) => {
  await sleep(delay)
  return poll({
    taskFn: requestCaptchaResults(apiKey, requestId),
    interval,
    retries,
  })
}

function requestCaptchaResults(apiKey: string, requestId: string) {
  const url = `https://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`
  return async function () {
    return new Promise(async function (resolve, reject) {
      const res = await axios.get(url)
      if (res.data.status === 0) return reject(res.data.request)
      resolve(res.data.request)
    })
  }
}

export const scrapePec = async (taxCode: string, personType: PersonType) => {
  const taxCodeField =
    personType === PersonType.NATURAL ? websiteDetails.naturalTaxCodeInputField : websiteDetails.legalTaxCodeInputField
  const pageUrl = `${websiteDetails.pageurl}${personType}`
  const { browser, page } = await instantiateBrowserAndPage()

  try {
    await page.goto(pageUrl, { waitUntil: 'load', timeout: __puppeteer_page_timeout_ms_time__ })
    const requestId = await initiateCaptchaRequest(websiteDetails.sitekey, process.env.CAPTCHA_API_KEY, pageUrl)

    await page.type(taxCodeField, taxCode)
    const requestResult = await pollForRequestResults(process.env.CAPTCHA_API_KEY, requestId)
    await page.evaluate(
      `document.getElementById("${websiteDetails.recaptchaInputField}").innerHTML="${requestResult}";`
    )
    await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), page.click(websiteDetails.submitButtonField)])

    try {
      const pec = await page.evaluate(
        "document.querySelector('a[data-clipboard-text]').getAttribute('data-clipboard-text')"
      )
      return pec
    } catch (error) {
      return null
    }
  } catch (error) {
    throw error
  } finally {
    await browser.close()
  }
}
