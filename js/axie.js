const productUrl = "https://graphql-gateway.axieinfinity.com/graphql";

const getAxieData = async(id) =>{
          const form = {
            "operationName": "GetAxieDetail",
            "variables": {
              "axieId": `${id}`
            },
            "query": "query GetAxieDetail($axieId: ID!) {\n  axie(axieId: $axieId) {\n    ...AxieDetail\n    __typename\n  }\n}\n\nfragment AxieDetail on Axie {\n  id\n  image\n  class\n  chain\n  name\n  genes\n  owner\n  birthDate\n  bodyShape\n  class\n  sireId\n  sireClass\n  matronId\n  matronClass\n  stage\n  title\n  breedCount\n  level\n  figure {\n    atlas\n    model\n    image\n    __typename\n  }\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  ownerProfile {\n    name\n    __typename\n  }\n  battleInfo {\n    ...AxieBattleInfo\n    __typename\n  }\n  children {\n    id\n    name\n    class\n    image\n    title\n    stage\n    __typename\n  }\n  __typename\n}\n\nfragment AxieBattleInfo on AxieBattleInfo {\n  banned\n  banUntil\n  level\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n"
          }
           
      const response = await fetch(productUrl, {
      method: 'POST',
      headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify(form),
      });
    const body = await response.json();
    console.log(body);    

}
const AddBuyButtonForAll = (selector) =>{
    if(document.getElementById("buyBTN0")){

    }else{
    for(let i =0;i<selector.length;i++){

      let inside = selector[i].childNodes[0];
      let i2 =inside.childNodes[0].childNodes[0].childNodes[0];	
  
      const flexDiv = document.createElement('div');
      flexDiv.class = 'flex';
      flexDiv.style = `/*all: unset; */width: 180px;`;
      const button = document.createElement('input');
      button.id=`buyBTN${i}`
      button.type = 'submit';
      button.value = 'Buy';
      button.style = `/*all: unset; */width: 112px;color: #ffffff;margin-left: 12px;background: #ff7838 ;height: 20px;border-radius: 5px 5px;font-size: 12px`;
      flexDiv.appendChild(button);
      i2.appendChild(flexDiv);
      button.onclick = e => buy(e,selector[i],`buyBTN${i}`);
    }
    
  }


}
const AddBuyButton = () =>{
  
  const AxieCard = new MutationObserver((mutations, self) => {
		const elem = document.getElementsByClassName('axie-card')[0];

		if (!(elem && elem.offsetParent)) {
      console.log(`AxieCard`);
			return;
      
		}

		self.disconnect();
    AddBuyButtonForAll(document.getElementsByClassName('axie-card'));

	});

	AxieCard.observe(document, {childList: true, subtree: true});
}
const buy = (e,elem,btnId) =>{
  e.preventDefault();
  let idURL= elem.parentElement.href;
  const id = idURL.split("/").pop();
  console.log(id);
  getAxieData(id);
  let btn = document.getElementById(btnId);
  btn.value="Attempting"
  let i =0;
  setInterval(()=>{
    if(i%2==0){
      btn.value="Making Request"
    }else{
      btn.value="Fetching Data"
    }
    
    i++;
  },[1000])
}
//ronin:1c28a9d627a9c9f0f23a25afcb7a5ff0cadb9180

//ronin:083caa1a088c0f43e4edadd952e21ff8116da159
const getStoredPrice = () => {
  return new Promise(resolve => {
      chrome.storage.local.get("maxPrice", (totalQuestions) => {
        resolve(totalQuestions);
      });
  });
};

const makeRedDiv =(elem) =>{
  let el = elem.parentElement.parentElement.parentElement;
  
  el.style = `/*all: unset; */background: rgba(117, 27, 27, 0.5);`;
    
  // console.log(el);
}

const markPrice = (priceArr,mp)=>{
  for(let i =0 ; i< priceArr.length; i++){
    let p1 = priceArr[i].innerHTML;
    p1 = p1.substring(1);
    var INT_PRICE = parseInt(p1);
    if(INT_PRICE > parseInt(mp)){
      //console.log(`price greater will turn red`);
      makeRedDiv(priceArr[i]);
    }
  }
}
const AddPriceColor = () =>{
    getStoredPrice().then(async (maxprice) => {

  const AXIE_PRICE = new MutationObserver((mutations, self) => {
		const elem =document.getElementsByClassName('truncate ml-8 text-gray-1 font-medium')[0];

		if (!(elem && elem.offsetParent)) {
			return;
      
		}
    markPrice(document.getElementsByClassName('truncate ml-8 text-gray-1 font-medium'),maxprice.maxPrice);
    self.disconnect();
	});

	AXIE_PRICE.observe(document, {childList: true, subtree: true});

})
}



let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();
  }
}).observe(document, {subtree: true, childList: true});
 
 
function onUrlChange() {
  
  AddBuyButton();
  AddPriceColor();
}
const buy1 = async() =>{
  const form = {
    "id":5,
     "jsonrpc":"2.0",
     "params":[{
       "to":"0x2da06d60bd413bcbb6586430857433bd9d3a4be4",
       "data":"0x684f6033000000000000000000000000c7467d460f50108d0afbeeaaa4b3622793d905380000000000000000000000000000000000000000000000000000000000192514",
       "from":"0x432cf96e17da360089e7af1535b4a917fa5e5b3e"},
       "latest"],
       "method":"eth_call"
      }
   
const response = await fetch("https://api.roninchain.com/rpc", {
method: 'POST',
headers: {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json'
  },
  credentials: 'same-origin',
  body: JSON.stringify(form),
});
const body = await response.json();
console.log(body);   

const form2 = {
  "id":5,
   "jsonrpc":"2.0",
   "method":"eth_estimateGas",
   "params":[{
     "to":"0x2da06d60bd413bcbb6586430857433bd9d3a4be4",
     "data":"0x684f6033000000000000000000000000c7467d460f50108d0afbeeaaa4b3622793d905380000000000000000000000000000000000000000000000000000000000192514",
     "from":"0x432cf96e17da360089e7af1535b4a917fa5e5b3e"}]
     
    }
 
const response2 = await fetch("https://api.roninchain.com/rpc", {
method: 'POST',
headers: {
'X-Requested-With': 'XMLHttpRequest',
'Content-Type': 'application/json'
},
credentials: 'same-origin',
body: JSON.stringify(form2),
});
const body2 = await response2.json();
console.log(`body2`);
console.log(body2);


chrome.runtime.sendMessage('fnjhmkhhmkbjkkabndcnnogagogbneec', {
  type: 'ask_provider_from_content_script',
  message: {id: 5,
jsonrpc: "2.0",
method: "eth_sendTransaction",
params: [{
chainId: 2020,
data: "0x684f6033000000000000000000000000c7467d460f50108d0afbeeaaa4b3622793d905380000000000000000000000000000000000000000000000000000000000192514",
from: "0x432cf96e17da360089e7af1535b4a917fa5e5b3e",
gas: "0xadb9",
to: "0x2da06d60bd413bcbb6586430857433bd9d3a4be4"
           }]}
})




}

window.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['Enabled'], (enb)=>{
    if(enb.Enabled){
      AddBuyButton();
      AddPriceColor();
      buy1();
    }
  })

  
  
});
