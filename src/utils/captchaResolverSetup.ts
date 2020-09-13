import axios from 'axios'

export const initiateCaptchaRequest = async (googleKey: string, apiKey: string, pageUrl: string) => {
  const formData = {
    method: 'userrecaptcha',
    googlekey: googleKey,
    key: apiKey,
    pageurl: pageUrl,
    json: 1,
  }
  const response = await axios({
    method: 'post',
    url: 'http://2captcha.com/in.php',
    params: formData,
  })
  return response.data.request
}
