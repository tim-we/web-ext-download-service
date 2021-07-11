const { http, https } = require("follow-redirects");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const chromeVersion = "91.0.4472.114";
const ua = `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`;

app.get("/cws/:extId([a-z0-9]{32})", (req, res) => {
    const extId = req.params.extId;

    const path = `/service/update2/crx?response=redirect&prodversion=${chromeVersion}&x=id%3D${extId}%26installsource%3Dondemand%26uc&nacl_arch=x86-64&acceptformat=crx2,crx3`;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/x-chrome-extension");
    res.setHeader("Content-Disposition", `attachment; filename="${extId}.crx"`);

    http.get(
        {
            path,
            hostname: "clients2.google.com",
            port: 80,
            headers: { "User-Agent": ua },
        },
        (resp) => resp.pipe(res)
    ).end();
});

app.listen(port, () => {
    console.log("Server running on port " + port);
});
