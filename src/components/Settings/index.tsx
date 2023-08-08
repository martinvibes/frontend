// import { Percent } from '@uniswap/sdk-core'
import { useState } from 'react'
import { useSorobanReact } from '@soroban-react/core'
import AnimatedDropdown from 'components/AnimatedDropdown'
import { AutoColumn } from 'components/Column'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { useRef } from 'react'
import styled from 'styled-components/macro'

import MaxSlippageSettings from './MaxSlippageSettings'
import MenuButton from './MenuButton'

const Menu = styled.div`
  position: relative;
`
export const Divider = styled("div")(({ theme }) => ({
  width: "100%",
  height: "1px",
  borderWidth: 0,
  margin: 0,
  backgroundColor: theme.palette.secondary.main,
}))


const MenuFlyout = styled(AutoColumn)`
  min-width: 20.125rem;
  background-color: ${({ theme }) => theme.backgroundSurface};
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  position: absolute;
  top: 100%;
  margin-top: 10px;
  right: 0;
  z-index: 100;
  color: ${({ theme }) => theme.textPrimary};
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    min-width: 18.125rem;
  `};
  user-select: none;
  padding: 16px;
`

const ExpandColumn = styled(AutoColumn)`
  gap: 16px;
  padding-top: 16px;
`

export default function SettingsTab({
  autoSlippage,
  chainId,
}: {
  autoSlippage: number
  chainId?: number
}) {
  const { address } = useSorobanReact()

  const node = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)

  useOnClickOutside(node, isOpen ? toggleMenu : undefined)

  return (
    <Menu ref={node}>
      <MenuButton disabled={!address} isActive={isOpen} onClick={toggleMenu} />
      {isOpen && (
        <MenuFlyout>
          <AnimatedDropdown open={true}>
            <ExpandColumn>
              <Divider />
              <MaxSlippageSettings autoSlippage={autoSlippage} />
            </ExpandColumn>
          </AnimatedDropdown>
        </MenuFlyout>
      )}
    </Menu>
  )
}
