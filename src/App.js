/* eslint-disable */
import React, { useRef, useState } from 'react';
import Web3 from 'web3'
import useStateWithCallback from 'use-state-with-callback';
import { create } from 'ipfs-http-client';
import axios from 'axios';
import { Typography, Button, Box, Grid, Stack, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { ryoshi_abi_fee_token } from './artifacts/RyoshiNFT'
// require('dotenv').config();
const key = "615fb1bafae90f82281c";
const secret = "dd48c20d5ac32a454e493be906351cc6991887ea06232b36010578fab78c9268";

var web3 = null;
const client = create('https://ipfs.infura.io:5001/api/v0')

const UPLOAD_TYPE = {
  IMAGE: "image",
  METADATA: "metadata"
}

// var metadata_template = {
//   "name": "",
//   "description": "",
//   "image": "",
//   "attributes": [{
//     "trait_type": "popular",
//     "value": 100
//   }],
//   "animation_url": ""
// }

function App() {
  const [imageUrl, setImageUrl] = useState("https://ipfs.infura.io/ipfs/QmPjPuf1W4SpYZ4rqARAsNqGBrdfXMVW5euh9AgL6uideS");
  const [metadataUrl, setMetadataUrl] = useState('');
  const [metaData, setMetaData] = useState({ name: '', description: '' });
  const [open, setOpen] = useState(false);
  const [disable, setDisable] = useState(false);
  const [userAccount, setUserAccount] = useStateWithCallback("", userAccount => {
    console.log("userAccount:", userAccount);
  });
  const [status, setStatus] = useState('');
  const [openseaUrl, setOpenseaUrl] = useState('');
  // const [contractAddress, setContractAdsress] = useState("0x8F2d332d58442D1deCDbD58DbD4316e28E8f3e17"); // no minting fee
  // const [contractAddress, setContractAdsress] = useState("0xfca2e3f8db4864a2fefa563a7a76e5d16611d7ee"); // minting fee
  const [contractAddress, setContractAdsress] = useState("0x7314d1a6369afd2cdcee1b9b26308ebcc8e70033"); // minting fee + token
  //  0x7314D1a6369AFD2CdceE1B9B26308eBCC8e70033


  const uploadImgRef = useRef(null);
  const uploadMetadataRef = useRef(null);

  const handleClose = () => {
    setOpen(false);
  };

  const conMetamask = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      web3 = new Web3(window.web3.currentProvider);
      console.log("metamask installed:");
      // setInstallMetamask(true);
      getAccount();
    } else {
      // Handle the case where the user doesn't have Metamask installed
      // Probably show them a message prompting them to install Metamask
      console.log("metamask not installed.");
    }
  }
  /// window.ethereum used to get addrss
  // const conMetamask = async () => {
  //   if (window.ethereum) {
  //     try {
  //       const addressArray = await window.ethereum.request({
  //         method: "eth_requestAccounts",
  //       });
  //       setStatus("address:" + addressArray[0]);
  //     } catch (err) {
  //       setStatus("error:", err.message);
  //     }
  //   } else {
  //     setStatus("connect metamask!");
  //   }
  // }


  const getAccount = () => {
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      setUserAccount(accounts[0]);
      console.log("account[0]:", accounts[0]);
    });
  }

  const shortAddress = (address) => {
    let lowCase = address.toLowerCase();
    return "0x" + lowCase.charAt(2).toUpperCase() + lowCase.substr(3, 3) + "..." + lowCase.substr(-4);
  }
  ///   using ipfs-clinet
  async function onUpload(e, type) {
    setDisable(true);
    const file = e.target.files[0];
    // pinFileToIPFS(file);
    try {
      setStatus('uploading file...');
      const added = await client.add(file)
      console.log(added);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      if (type === UPLOAD_TYPE.IMAGE) {
        setImageUrl(url);
      } else if (type === UPLOAD_TYPE.METADATA) {
        setMetadataUrl(url);
      }
      setStatus(type + ' is uploaded at:' + url);
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
    setDisable(false);
  }
  ///////////     using pinata api
  // async function onUpload(e, type) {
  //   setDisable(true);
  //   const file = e.target.files[0];
  //   // pinFileToIPFS(file);
  //   try {
  //     setStatus('uploading file...');
  //     const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  //     axios
  //       .post(url, file, {
  //         maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
  //         headers: {
  //           'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
  //           pinata_api_key: key,
  //           pinata_secret_api_key: secret
  //         }
  //       })
  //       .then(function (response) {
  //         setMetadataUrl("https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash);
  //         setStatus("image uploaded at https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash);
  //         setDisable(false);
  //       })
  //       .catch(function (error) {
  //         setStatus("image upload fail", error.message);
  //         setDisable(false);
  //       });
  //   } catch (error) {
  //     console.log('Error uploading file: ', error)
  //   }
  //   setDisable(false);
  // }
  ////  using pinata for uploading file(image)
  // const pinFileToIPFS = (file) => {
  //   setStatus("image uploading now...");
  //   const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  //   //we gather a local file from the API for this example, but you can gather the file from anywhere
  //   let data = new FormData();
  //   data.append('file', fs.createReadStream('./yourfile.png'));
  //   // data.append('file', file);
  //   axios.post(url,
  //     data,
  //     {
  //       headers: {
  //         'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
  //         'pinata_api_key': key,
  //         'pinata_secret_api_key': secret
  //       }
  //     }
  //   ).then(function (response) {
  //     setImageUrl("https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash);
  //     setStatus("image uploaded at", "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash);
  //     setDisable(false);
  //   }).catch(function (error) {
  //     setStatus("image upload fail", error.message);
  //     setDisable(false);
  //   });
  // };

  const onMetaDataChange = (e) => {
    setMetaData({ ...metaData, [e.target.name]: e.target.value });
  }

  const onClickUpload = (type) => {
    if (type === UPLOAD_TYPE.IMAGE) {
      uploadImgRef.current.click();
    } else if (type === UPLOAD_TYPE.METADATA) {
      uploadMetadataRef.current.click();
    }
  }

  // const makeMetadataFile = async () => {
  //   console.log(metaData);
  //   if (metaData.name === "" || metaData.description === "" || imageUrl === "") {
  //     // if (metaData.name === "" || metaData.description === "") {
  //     setOpen(true);
  //     return;
  //   }
  //   metadata_template["name"] = metaData.name;
  //   metadata_template["description"] = metaData.description;
  //   metadata_template["image"] = imageUrl;

  //   const data = JSON.stringify(metadata_template);

  //   const fileName = "ryoshi_metadata.json";
  //   const blob = new Blob([data], { type: 'application/json' });
  //   const href = await URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = href;
  //   link.download = fileName;
  //   document.body.appendChild(link);
  //   link.click();
  //   console.log("link:", link);
  //   document.body.removeChild(link);
  //   // await api.get('/addfile');
  //   setStatus('metadata.json is created');
  // }

  const uploadMetadata = async () => {
    // console.log(metaData);
    setDisable(true);
    // setImageUrl("https://ipfs.infura.io/ipfs/QmPjPuf1W4SpYZ4rqARAsNqGBrdfXMVW5euh9AgL6uideS");
    if (metaData.name === "" || metaData.description === "") {
      // if (metaData.name === "" || metaData.description === "") {
      setOpen(true);
      setDisable(false);
      return;
    }

    //make metadata
    setStatus("metadata uploading now");
    const metadata = new Object();
    metadata.name = metaData.name;
    metadata.image = imageUrl;
    metadata.description = metaData.description;

    //make pinata call
    await pinJSONToIPFS(metadata);
    // try{
    //   const cid = await client.add(
    //     { path: 'metadata0.json', content: JSON.stringify(metadata) }, 
    //     { wrapWithDirectory: true }
    //   );
    //   console.log(cid);
    //   setMetadataUrl(cid);
    //   setStatus(`metadata uploaded at https://ipfs.infura.io/ipfs/${cid.cid.toString()}`);
    //   setDisable(false);
    // }catch(err){
    //   console.log('metadata err',err);
    // }    
  }

  const pinJSONToIPFS = async (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata
    axios.post(url, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      }
    })
      .then(function (response) {
        setMetadataUrl("https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash);
        setStatus("metadata uploaded at https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash);
        setDisable(false);
      })
      .catch(function (error) {
        setStatus("metadata upload fail", error.message);
        setDisable(false);
      });
  };

  const mint = (tokenUri) => {
    if (userAccount === "") {
      setStatus("Please check connection to metamask!");
      return;
    }
    console.log("tokenUri:", tokenUri);
    if (tokenUri === "") {
      setStatus("Please upload metadata");
      return;
    }
    setDisable(true);
    setStatus("NFT is minting now...");
    let ryoshi = new web3.eth.Contract(ryoshi_abi_fee_token, contractAddress);
    ryoshi.methods.createCollectible(tokenUri).send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") }).on("receipt", (receipt) => {
      // console.log("receipt:", receipt);
    }).on("error", (error) => {
      setStatus("NFT minting fail.");
      setDisable(false);
    });
    ryoshi.events.Transfer({ filter: { to: userAccount } })
      .on("data", function (event) {
        let data = event.returnValues;
        setStatus(`You have minted NFT(${data.tokenId}) successfully.`);
        setOpenseaUrl(`https://testnets.opensea.io/assets/${contractAddress}/${data.tokenId}`);
        setDisable(false);
      }).on("error", (error) => {
        setDisable(false);
      });
  }

  return (
    <Grid container direction="column" spacing="2">
      <Grid item>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "rgb(179, 0, 0)", p: 1 }}>
          <img src="/logo.png" width="128px"></img>
          <Typography variant="h2" color="rgb(26, 26, 26)" sx={{ fontWeight: 'bold' }}>
            RyoShi Vision
          </Typography>
          <Button variant="contained" color="primary" onClick={conMetamask} sx={{ textTransform: "inherit" }}>
            Connect wallet:{userAccount && shortAddress(userAccount)}
          </Button>
        </Stack>
      </Grid>
      <Grid item>
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{ backgroundColor: "rgb(51, 51, 51)", p: 3 }}>
          <Typography variant="body1" color="primary" sx={{ backgroundColor: "white" }}>
            {status}
          </Typography>
          {openseaUrl && (<a href={openseaUrl} target="_blank" style={{ color: "white" }}>click here to check on Opensea(testnet).</a>)}
          <TextField name="name" label="name" variant="filled" onChange={onMetaDataChange} sx={{ backgroundColor: "rgb(255,255,255)", width: "300px" }} />
          <TextField
            name="description"
            label="description"
            multiline
            rows={4}
            defaultValue=""
            variant="filled"
            onChange={onMetaDataChange}
            sx={{ backgroundColor: "rgb(255,255,255)", width: "300px" }}
          />
          <input type="file" ref={uploadImgRef} onChange={(e) => onUpload(e, "image")} hidden />
          <input type="file" ref={uploadMetadataRef} onChange={(e) => onUpload(e, "metadata")} hidden />
          <Stack direction="row" spacing={5}>
            <Button variant="contained" color="primary" disabled={disable} onClick={() => onClickUpload(UPLOAD_TYPE.IMAGE)} sx={{ textTransform: "inherit" }}>
              Upload Image
            </Button>
            {/* <Button variant="contained" color="primary" disabled={disable} onClick={makeMetadataFile} sx={{ textTransform: "inherit" }}>
              Make metadata
            </Button> */}
            <Button variant="contained" color="primary" disabled={disable} onClick={uploadMetadata} sx={{ textTransform: "inherit" }}>
              Upload metadata
            </Button>
            <Button variant="contained" disabled={disable} onClick={() => mint(metadataUrl)} sx={{ textTransform: "inherit", backgroundColor: "rgb(179, 0, 0)" }}>
              Mint
            </Button>
          </Stack>
          <Box component="div" sx={{ backgroundColor: "rgb(255,255,255)" }}>
            <img src={imageUrl || '/empty.png'} width="auto" alt={imageUrl} />
          </Box>
        </Stack>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Metadata can't be empty!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please check whether input data is empty or image file is uploaded.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default App;
