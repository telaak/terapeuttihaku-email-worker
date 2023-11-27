# Terapeuttihaku.fi Cloudflare Email Worker

Yksinkertainen sähköpostinkäsittelijä, joka välittää sähköpostin tiedot eteenpäin ja alkuperäisen viestin toiseen sähköpostiosoitteeseen.

## Aloittaminen

### Vaatimukset

* Node.js
* Cloudflare Wrangler [https://developers.cloudflare.com/workers/wrangler/](https://developers.cloudflare.com/workers/wrangler/)

### Asentaminen

1. `git pull github.com/telaak/terapeuttihaku-email-worker.git`
2. Asenna paketit `npm i`
3. Kirjaudu sisään Wrangleriin `npx wrangler login`
4. Täytä vaadittavat ympäristömuuttujat Cloudflaren secrets-osioon:
      * API_URL (osoite johon sähköpostien data lähetetään HTTP POST:lla)
      * SECRET ("salasana" jonka taustajärjestelmä tarkistaa)
      * FORWARD_EMAIL (sähköpostiosoite johon viestit välitetään)
5. Asenna Cloudflare:en `npx wrangler deploy`

### Kuvaohjeita

1. Avaa Cloudflare Dashboard
2. Valitse sivusi
3. Valitse vasemmasta laidasta "Email" -> "Email Workers", ja tarkista että Worker on asentunut

![image](https://github.com/telaak/terapeuttihaku-email-worker/assets/35933416/9a13f27d-f1fd-4e7a-8444-5ef83625515d)

4. Paina "Create route"-painiketta

![image](https://github.com/telaak/terapeuttihaku-email-worker/assets/35933416/3383e91c-e83c-481a-9f6e-41c3272738da)

5. Valitse sähköpostille reitti, ja tallenna se.


## License

This project is licensed under the MIT License - see the LICENSE.md file for details
