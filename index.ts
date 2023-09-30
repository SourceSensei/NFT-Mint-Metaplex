import { Connection, clusterApiUrl, PublicKey, Keypair } from "@solana/web3.js";
import {
  Metaplex,
  bundlrStorage,
  keypairIdentity,
} from "@metaplex-foundation/js";
import * as dotenv from "dotenv";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";

dotenv.config();

async function main() {
  const payer = getKeypairFromEnvironment("SECRET_KEY");
  const connection = new Connection(clusterApiUrl("devnet"));

    console.log("Payer address:", payer.publicKey.toBase58());

  const metadata = {
    name: "InstagramNFT",
    symbol: "INFT",
    description: "My new custom NFT",
    image:
      "https://s2.glbimg.com/6fLjMPYo50gB1llNwE11EVXdf8w=/620x430/e.glbimg.com/og/ed/f/original/2022/02/21/https___hypebeast.com_image_2021_10_bored-ape-yacht-club-nft-3-4-million-record-sothebys-metaverse-0.jpg",
  };

  const metaplex = Metaplex.make(connection)
    // set our keypair to use, and pay for the transaction
    .use(keypairIdentity(payer))
    // define a storage mechanism to upload with
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );

  console.log("Uploading metadata...");

  const { uri } = await metaplex.nfts().uploadMetadata(metadata);

  console.log("Metadata uploaded:", uri);

  console.log("Creating NFT using Metaplex...");

  const { nft, response } = await metaplex.nfts().create({
    uri,
    name: metadata.name,
    symbol: metadata.symbol,

    // `sellerFeeBasisPoints` is the royalty that you can define on nft
    sellerFeeBasisPoints: 500, // Represents 5.00%.

    isMutable: true,
  });

  console.log(nft);
  console.log({ txSignature: response.signature });

  return;

}

main();
