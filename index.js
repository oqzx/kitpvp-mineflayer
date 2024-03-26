const mineflayer = require('mineflayer');
const chalk = require('chalk');
const fs = require('fs');

let config;
try {
  config = JSON.parse(fs.readFileSync('config.json'));
} catch (err) {
  console.error(`${chalk.red('Error parsing config.json:')} ${chalk.gray(err)}`);
  process.exit(1); 
}

const bots = [];

console.log(chalk.greenBright('Setting up bot instances...'));

async function setupBots() {
  const botPromises = config.map(botConfig => {
    return new Promise((resolve, reject) => {
      const bot = mineflayer.createBot({
        host: 'play.pika-network.net',
        port: 25565, 
        username: botConfig.name,
        version: '1.8.9'
      });

      bot.once('spawn', () => {
        console.log(`${chalk.cyan('Logged into')} ${chalk.magenta.italic(`play.pika-network.net`)} ${chalk.cyan('as')} ${chalk.magenta.italic(bot.username)}${chalk.cyan('.')}`);
        bot.chat(`/login ${botConfig.password}`);
        setTimeout(() => {
          bot.chat('/server kit-pvp'); 
          setTimeout(() => {
            claimGKit(bot); 
          }, 3000);
        }, 3000); 
        resolve(bot); 
      });

      bot.on('error', (err) => {
        reject(err);
      });

      bot.recipient = botConfig.recipient;
    });
  });

  try {
    await Promise.all(botPromises);
    console.log(chalk.greenBright('All bots are set up.'));
  } catch (error) {
    console.error(`${chalk.red('Error setting up bots:')} ${error}`);
  }
}

setupBots().then(() => {
  console.log(chalk.greenBright('Bot instances are running.'));
});

console.log(chalk.greenBright('Bot instances are set up.'));

async function claimGKit(bot) {
  const gkitSlotsToClick = [10, 11, 12, 13, 14, 15, 16, 19, 20];

  try {
    for (const slotIndex of gkitSlotsToClick) {
      await new Promise((resolve) => {
        bot.chat(`/gkit`);
        bot.once('windowOpen', () => {
          setTimeout(async () => {
            try {
              await bot.clickWindow(slotIndex, 0, 0);
              console.log(`${chalk.cyan('Claiming GKit on slot')} ${chalk.gray(slotIndex)}. ${chalk.gray(`(${bot.username})`)}`);
            } catch (error) {
              console.log(`${chalk.blueBright('Claiming GKit on slot')} ${chalk.gray(slotIndex)}. ${chalk.gray(`(${bot.username})`)}`);
            } finally {
              console.log(`${chalk.green('Success.')}${chalk.gray(`(${bot.username})`)}`);
              resolve();
            }
          }, 1000);
        });
      });
    }
    console.log(`${chalk.greenBright('All GKit items claimed.')} ${chalk.gray(`(${bot.username})`)}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    giftItems(bot, bot.recipient); 
  } catch (err) {
    console.error(`${chalk.red('Error claiming GKit items:')} ${chalk.gray(`(${bot.username})`)}`, err);
  }
}

async function giftItems(bot, recipient) {
  const openGiftGUI = () => {
    return new Promise((resolve) => {
      bot.chat(`/gift ${recipient}`);
      bot.once('windowOpen', () => resolve());
    });
  };

  const moveItemsToGUI = () => {
    return new Promise((resolve) => {
      const moveNextSlot = async (index) => {
        if (index < bot.inventory.slots.length) {
          const slot = bot.inventory.slots[index];
          if (slot) {
            bot.currentWindow.requiresConfirmation = false;
            await new Promise((resolveClick) => {
              setTimeout(async () => {
                await bot.clickWindow(index, 0, 0);
                console.log(`${chalk.yellowBright('Clicked on slot')} ${chalk.gray(index)} ${chalk.gray(`(${bot.username})`)}`);
                resolveClick();
              }, 2000);
            });
          }
          moveNextSlot(index + 1); 
        } else {
          setTimeout(() => {
            bot.closeWindow(bot.currentWindow);
            console.log(`${chalk.magenta('Closing gift GUI...')} ${chalk.gray(`(${bot.username})`)}`);
          }, 2000);
  
          bot.once('windowClose', () => {
            console.log(`${chalk.cyanBright('Gift GUI closed.')} ${chalk.gray(`(${bot.username})`)}`);
            resolve();
          });
        }
      };
  
      moveNextSlot(0);
    });
  };      

  const waitForConfirmationWindow = () => {
    return new Promise((resolve) => {
      bot.once('windowOpen', async (window) => {
        console.log(`${chalk.blueBright('Confirmation window opened.')} ${chalk.gray(`(${bot.username})`)}`);
        console.log(`${chalk.yellow('Confirmation window contents:')} ${chalk.gray(`(${bot.username})`)}`);
        window.slots.forEach((slot, index) => {
          if (slot) {
            console.log(`${chalk.gray('Slot')} ${index}: ${slot.displayName || slot.name}`);
          }
        });
  
        const confirmButtonSlot = 11;
        if (window.slots[confirmButtonSlot]) {
          console.log(`${chalk.yellowBright('Confirm button found.')} ${chalk.gray(`(${bot.username})`)}`);
          await bot.clickWindow(confirmButtonSlot, 0, 0);
          console.log(`${chalk.blueBright('Confirmation button clicked.')} ${chalk.gray(`(${bot.username})`)}`);
        } else {
          console.log(`${chalk.red('Confirmation button not found.')} ${chalk.gray(`(${bot.username})`)}`);
        }

        bot.once('windowClose', () => {
          console.log(`${chalk.greenBright('Confirmation window closed.')} ${chalk.gray(`(${bot.username})`)}`);
          resolve();
        });
      });
    });
  };

  try {
    console.log(`${chalk.yellowBright('Initiating gift process...')} ${chalk.gray(`(${bot.username})`)}`);
    await openGiftGUI();
    console.log(`${chalk.whiteBright('Gift GUI opened.')} ${chalk.gray(`(${bot.username})`)}`);
    await moveItemsToGUI();
    await waitForConfirmationWindow();
    console.log(`${chalk.greenBright('Confirmation process completed.')} ${chalk.gray(`(${bot.username})`)}`);
  } catch (err) {
    console.error(`${chalk.red('Error gifting items:')} ${chalk.gray(`(${bot.username})`)}`, err);
  }
}