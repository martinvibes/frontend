import { Button } from "@mui/material";
import {
    contractTransaction,
    useSendTransaction
} from "@soroban-react/contracts";
import { SorobanContextType } from "@soroban-react/core";
import BigNumber from "bignumber.js";
import { useState } from "react";
import * as SorobanClient from "soroban-client";
import { bigNumberToI128 } from "../../helpers/utils";

interface DepositButtonProps {
  pairAddress: string;
  amount0: BigNumber;
  amount1: BigNumber;
  sorobanContext: SorobanContextType;
}

export function DepositButton({
  pairAddress,
  amount0,
  amount1,
  sorobanContext,
}: DepositButtonProps) {
  const [isSubmitting, setSubmitting] = useState(false);
  const networkPassphrase = sorobanContext.activeChain?.networkPassphrase ?? "";
  const server = sorobanContext.server;
  const account = sorobanContext.address;
  const { sendTransaction } = useSendTransaction();

  const depositTokens = async () => {
    setSubmitting(true);

    //Parse amount to mint to BigNumber and then to i128 scVal
    const desiredAScVal = bigNumberToI128(amount0);
    const desiredBScVal = bigNumberToI128(amount1);

    const minAScVal = bigNumberToI128(amount0.multipliedBy(0.9).decimalPlaces(0));
    const minBScVal = bigNumberToI128(amount1.multipliedBy(0.9).decimalPlaces(0));

    let walletSource;

    if (!account) {
      console.log("Error on account:", account)
      return;
    }

    try {
      walletSource = await server?.getAccount(account!);
    } catch (error) {
      alert("Your wallet or the token admin wallet might not be funded");
      setSubmitting(false);
      return;
    }
    if(!walletSource){
      console.log("Error on walletSource:", walletSource)
      return
    }    

    const options = {
      sorobanContext,
    };

    try {
      //Builds the transaction
      let tx = contractTransaction({
        source: walletSource!,
        networkPassphrase,
        contractAddress: pairAddress,
        method: "deposit",
        args: [
          new SorobanClient.Address(account!).toScVal(),
          desiredAScVal,
          minAScVal,
          desiredBScVal,
          minBScVal
        ],
      });

      //Sends the transactions to the blockchain
      console.log(tx);

      let result = await sendTransaction(tx, options);

      if (result) {
        alert("Success!");
      }
      console.log(
        "🚀 ~ file: DepositButton.tsx ~ depositTokens ~ result:",
        result,
      );

      //This will connect again the wallet to fetch its data
      sorobanContext.connect();
    } catch (error) {
      console.log("🚀 « error:", error);
    }

    setSubmitting(false);
  };

  return (
    <Button variant="contained" onClick={depositTokens} disabled={isSubmitting}>
      Deposit Liquidity!
    </Button>
  );
}
