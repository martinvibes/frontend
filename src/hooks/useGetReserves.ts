import { useSorobanReact } from '@soroban-react/core';
import useSWRImmutable from 'swr/immutable';
import { reservesBigNumber } from './useReserves';

interface Props {
  pairAddress?: string;
}

const useGetReserves = ({ pairAddress }: Props) => {
  const sorobanContext = useSorobanReact();
  const { data, error, isLoading, mutate } = useSWRImmutable(
    ['reserves', pairAddress],
    ([key, pairAddress]) => reservesBigNumber(pairAddress ?? '', sorobanContext),
  );

  return { data, isError: error, isLoading, mutate };
};

export default useGetReserves;
