case "play": {
    if (!text) return m.reply(penggunaan('we dont talk'))
    await falcon.sendMessage(m.chat, { react: { text: '🔎', key: m.key } })

    let ytsSearch = await yts(text)
    const anuan = ytsSearch.all
    if (!anuan.length) return m.reply("Tidak ditemukan hasil untuk pencarian tersebut!")

    let teksnya = "📽 *Hasil Pencarian YouTube*\n\nPilih salah satu untuk mendengarkan atau menonton:"
    
    let sections = []
    let addedTitles = new Set()

    for (let res of anuan.slice(0, 7)) {
        let title = res.title
        let channel = res.author.name || "Unknown"
        let duration = res.timestamp
        let views = res.views
        
        if (!addedTitles.has(title)) {
            sections.push({
                "title": title, 
                "rows": []
            })
            addedTitles.add(title)
        }

        let sectionIndex = sections.findIndex(sec => sec.title === title)

        sections[sectionIndex].rows.push({
            "title": "🎶 Play Audio",
            "description": `📢 ${channel} • ⏳ ${duration}`,
            "id": `.xytmp3 ${res.url}`
        })
        sections[sectionIndex].rows.push({
            "title": "📺 Play Video",
            "description": `📢 ${channel} • ⏳ ${duration}`,
            "id": `.xytmp4 ${res.url}`
        })
    }

    let msgii = generateWAMessageFromContent(m.chat, { 
        viewOnceMessage: { 
            message: { 
                "messageContextInfo": { "deviceListMetadata": {}, "deviceListMetadataVersion": 2 }, 
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    contextInfo: { mentionedJid: [m.sender], externalAdReply: { showAdAttribution: true }}, 
                    body: proto.Message.InteractiveMessage.Body.create({ text: teksnya }), 
                    footer: proto.Message.InteractiveMessage.Footer.create({ text: global.foother }), 
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ 
                        buttons: [{
                            "name": "single_select",
                            "buttonParamsJson": `{ "title": "Pilih Opsi", "sections": ${JSON.stringify(sections)} }`
                        }]
                    })
                }) 
            } 
        }
    }, { userJid: m.sender, quoted: null }) 

    await falcon.relayMessage(msgii.key.remoteJid, msgii.message, { messageId: msgii.key.id })
}
break
```
