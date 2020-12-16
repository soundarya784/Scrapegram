const puppeteer = require('puppeteer')
const ora = require('ora')
const chalk = require('chalk')
const fs = require('fs')



const self = module.exports = {
  findDuplicateInArray: async (hrefs) => {
    let i = hrefs.length
    let len = hrefs.length
    let result = []
    let obj = {}
    for (i = 0; i < len; i++) {
      obj[hrefs[i]] = 0
    }
    for (i in obj) {
      result.push(i)
    }
    return result
  },

  randomInt: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  getMedia: async (page, scrollLimit, item, mode) => {
    let mediaText = []
    let previousHeight
    let spinner = ora('Loading').start()
    for (let i = 1; i <= scrollLimit; i++) {
      try {
        previousHeight = await page.evaluate('document.body.scrollHeight')
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`)
        await page.waitFor(self.randomInt(400, 1000))
        spinner.color = 'yellow'
        let modeName = '' 
        if (mode === 'hashtags') {
          modeName = 'Tags: '
        } else if (mode === 'account') {
          modeName = 'Account: '
        } else if (mode === 'locations') {
          modeName = 'Locations: '
        }
        spinner.text = chalk.yellow(modeName + item + ' | ⏳ Scrolling [ ' + i + ' / ' + scrollLimit + ' ]')
        const textPost = await page.evaluate(() => {
          const images = document.querySelectorAll('a > div > div.KL4Bh > img')
          return [].map.call(images, img => img.src)
        })
        for (let post of textPost) {
          mediaText.push(post)
        }
        mediaText = await self.findDuplicateInArray(mediaText)
      } catch (e) {
        spinner.fail(chalk.red('Scroll Timeout ' + e))
        await page.evaluate('window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop)')
        const imgPost = await page.evaluate(() => {
          const images = document.querySelectorAll('a > div > div.KL4Bh > img')
          return [].map.call(images, img => img.src)
        })
        for (let post of imgPost) {
          mediaText.push(post)
        }
        mediaText = await self.findDuplicateInArray(mediaText)
        break
      }
    }
    spinner.succeed(chalk.yellow('Scroll Succeed'))
    return mediaText
  },

  makeFolder: async (item, mode) => {
    try {
      if (mode === 'hashtags') {
        
          // let dir = './result/tags/' + item
          console.log("lalala"+item);
          let dir = './result/tags/'+item;
          console.log(dir);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
            
          }
        
      } else if (mode === 'account'){
        let dir = './result/account/' + item
        console.log(dir);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir)
        }
      } else if (mode === 'locations'){
        let dir = './result/locations/' + item
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir)
        }
      }
    } catch (err) {
      console.log(chalk.red('❌ Error makeFolder: ' + err))
    }
  },

  splitUp: (arr, n) => {
    let rest = arr.length % n
    let restUsed = rest
    let partLength = Math.floor(arr.length / n)
    let result = []
    for (let i = 0; i < arr.length; i += partLength) {
      let end = partLength + i
      let add = false
      if (rest !== 0 && restUsed) {
        end++
        restUsed--
        add = true
      }
      result.push(arr.slice(i, end))
      if (add) {
        i++
      }
    }
    return result
  },

  saveImage: async (page, item, urlImg, bot, mode, limit) => {
    let count = 0
    let countTotal = urlImg.length
    for (const img of urlImg) {
      try {
        let viewSource = await page.goto(img)
        let modePath = '' 
        if (mode === 'hashtags') {
          modePath = './result/tags/'
        } else if (mode === 'account') {
          modePath = './result/account/'
        } else if (mode === 'locations') {
          modePath = './result/locations/'
        }
        if(count == limit){
          break;
        }
        fs.writeFile(modePath + item + '/bot-' + bot + '-' + count + '.jpg', await viewSource.buffer(), function (err) {
          if (err) {
            throw (err)
          }
          count = count + 1
          console.log(chalk.green('BOT🤖[' + bot + ']The file was saved! [ ' + count + ' / ' + countTotal + ' ]'))
        })
      } catch (error) {
        console.log(chalk.red('❌ Error: invalid URL undefined'))
        continue
      }
    }
  },

  main: async (quest, mode) => {
    const browser = await puppeteer.launch({headless: false})
    if (mode === 'hashtags') {
      let tags = quest.hashtag
     
      const scrollLimit = parseInt(quest.scroll)
      console.log(tags);
      
      await self.makeFolder(tags, 'hashtags')
        const page = await browser.newPage()
        page.on('error', () => {
          console.log(chalk.red('🚀 Page Reload'))
          page.reload()
        })
        await page.goto('https://www.instagram.com/explore/tags/' + tags + '/', {
          timeout: 0
        })
        let urlImg = await self.getMedia(page, scrollLimit, tags, 'hashtags')
        console.log(chalk.cyan('🌄 Images Total: ' + urlImg.length))
        const arraySplit = await self.splitUp(urlImg, 0)
        await page.close()
        const promises = []
        var thiscount = 0;
        for (let i = 0; i < arraySplit.length; i++) {
          promises.push(browser.newPage().then(async page => {
            page.on('error', () => {
              console.log(chalk.red('🚀 Page Reload'))
              page.reload()
            })
            await self.saveImage(page, tags, arraySplit[i], i, 'hashtags',scrollLimit)
            await page.close()
          }))
          if(thiscount == scrollLimit){
            break;
          }
          thiscount+=1

        }
        await Promise.all(promises)
        console.log(chalk.green('✅ Succeed'))
      
    } else if (mode === 'account'){
      const account = quest.account
      const scrollLimit = parseInt(quest.scroll)
      await self.makeFolder(account, 'account')
      const page = await browser.newPage()
      page.on('error', () => {
        console.log(chalk.red('🚀 Page Reload'))
        page.reload()
      })

      await page.goto('https://www.instagram.com/accounts/login/', {
    waitUntil: 'networkidle0',
  });

  // Wait for log in form

  await Promise.all([
    page.waitForSelector('[name="username"]'),
    page.waitForSelector('[name="password"]'),
    page.waitForSelector('[type="submit"]'),
  ]);

  // Enter username and password

  await page.type('[name="username"]', 'moe.lester.hajmola');
  await page.type('[name="password"]', 'instapass');

  // Submit log in credentials and wait for navigation

  await Promise.all([
    page.click('[type="submit"]'),
    page.waitForNavigation({
      waitUntil: 'networkidle0',
    }),
  ]);




      
      
      
      await page.goto('https://www.instagram.com/' + account + '/', {
        timeout: 0
      })
      var acc_priv = 1;
      let urlImg = await self.getMedia(page, scrollLimit, account, 'account')
      console.log(chalk.cyan('🌄 Image Total: ' + urlImg.length))
      acc_priv = urlImg.length;
      const arraySplit = await self.splitUp(urlImg, 0) // Bot 10
      await page.close()
      const promises = []
      var thiscount = 0;
      for (let i = 0; i < arraySplit.length; i++) {
        promises.push(browser.newPage().then(async page => {
          page.on('error', () => {
            console.log(chalk.red('🚀 Page Reload'))
            page.reload()
          })
          await self.saveImage(page, account, arraySplit[i], i, 'account',scrollLimit)
          await page.close()

        }))
        if(thiscount == scrollLimit){
          break;
        }
        thiscount+=1
      }
      await Promise.all(promises)
      console.log(chalk.green('✅ Succeed'))
    } else if (mode === 'locations'){
      const locations = quest.locations
      const scrollLimit = parseInt(quest.scroll)
      await self.makeFolder("location1", 'locations')
      const page = await browser.newPage()
      page.on('error', () => {
        console.log(chalk.red('🚀 Page Reload'))
        page.reload()
      })
      await page.goto(locations, {
        timeout: 0
      })
     

      
      let urlImg = await self.getMedia(page, scrollLimit, locations, 'locations')
      console.log(chalk.cyan('🌄 Image Total: ' + urlImg.length))
      const arraySplit = await self.splitUp(urlImg, 0) // Bot 10
      await page.close()
      const promises = []
      var thiscount = 0;
      for (let i = 0; i < arraySplit.length; i++) {
        promises.push(browser.newPage().then(async page => {
          page.on('error', () => {
            console.log(chalk.red('🚀 Page Reload'))
            page.reload()
          })
          await self.saveImage(page, "location1", arraySplit[i], i, 'locations',scrollLimit)
          await page.close()
        }))
        if(thiscount == scrollLimit){
          break;
        }
        thiscount+=1
      }
      await Promise.all(promises)
      console.log(chalk.green('✅ Succeed'))
    }
    await browser.close()
    return Promise.resolve(acc_priv);
  }
}
