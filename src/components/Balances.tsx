import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useSorobanReact } from "@soroban-react/core";
import { tokenBalances, tokenBalancesType } from "hooks";
import { useEffect, useState } from "react";
import { useTokens } from "../hooks/useTokens";

export function Balances() {
  const sorobanContext = useSorobanReact();
  const tokens = useTokens(sorobanContext);

  // State to hold token balances
  const [tokenBalancesResponse, setTokenBalancesResponse] = useState<tokenBalancesType | undefined>();

  // Effect to fetch token balances
  useEffect(() => {
    if (sorobanContext.activeChain && sorobanContext.address && tokens.length > 0) {
      tokenBalances(sorobanContext.address, tokens, sorobanContext, true).then((resp) => {
        setTokenBalancesResponse(resp);
      });
    }
  }, [sorobanContext, tokens]);

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Balances
        </Typography>
        {sorobanContext.address && tokens.length > 0 ? (
          <>
            {tokenBalancesResponse?.balances?.map((tokenBalance) => (
              <p key={tokenBalance.address}>
                {tokenBalance.symbol} : {tokenBalance.balance as string}
              </p>
            ))}
          </>
        ) : (
          <div>Connect your Wallet</div>
        )}
      </CardContent>
    </Card>
  );
}
