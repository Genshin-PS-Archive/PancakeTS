# pancake-ts
## Changelog
Managed to make this some what plug and play

- Added a file for each packet
- Added `player.ts` and `player.json`
- Added a somewhat working console
- pain

## How to install
* Run `npm i` to install all the modules
* Run `npm run devstart` to start the server

### **Warning**
You need json files in `src/json` to make this **work**, for now i will not provide them because they contain **private info**.

You can get yourself the json files using [protobuf2json](https://github.com/pancake-server/protobuf2json) (you still need bin files tho)

## How to play
* Install [fiddler](https://www.telerik.com/download/fiddler) to intercept HTTP requests (i swear i will change it to some C++ program someday)
* Open fiddler go to Fiddler Scripts and paste the fiddler script provided
* Go to `options > HTTPS > Capture HTTPs CONNECTs > Decrypt HTTPS traffic`
* Accept the cert thing that appears
* Start the server and start genshin and have fun

## Credits
- **leenjewel** for doing [node-kcp](https://github.com/leenjewel/node-kcp/)
- **LADI** for providing the [proto](https://github.com/pancake-server/proto) and packet id files
- **NicknameGG** for doing his best
- **The guy** who gave me the encryption
- **Hades** for doing YSFreedom as a base
- To **the leaker** that leaked the first pancake ~~**(fock you)**~~
- And **you**, yes, **you**. I want to let you know that you're beatiful and i love you
