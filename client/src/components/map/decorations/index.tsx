import { memo } from 'react';
import type { DecorationKind } from '@wondermap/shared';
import { Tree, Pine, Bush, Rock, Flower, Grass, Cloud } from '../art/flora';
import { Cottage, Hall, Lamp, Bridge, Mountain } from '../art/houses';

interface Props {
  kind: DecorationKind;
  /** Per-instance seed: drives species, proportions, lean and clump layout. */
  seed?: number;
  className?: string;
}

type ArtComponent = React.ComponentType<{ seed?: number; className?: string }>;

const REGISTRY: Record<DecorationKind, ArtComponent> = {
  tree: Tree,
  pine: Pine,
  bush: Bush,
  rock: Rock,
  flower: Flower,
  grass: Grass,
  mountain: Mountain,
  building: Cottage,
  castle: Hall,
  lamp: Lamp,
  bridge: Bridge,
  cloud: Cloud,
};

export const Decoration = memo(function Decoration({ kind, seed = 1, className }: Props) {
  const Comp = REGISTRY[kind] ?? Tree;
  return <Comp seed={seed} className={className} />;
});

export {
  Tree, Pine, Bush, Rock, Flower, Grass, Cloud, Boat, Smoke, Bunting, Bird, Lake, ForestMass,
} from '../art/flora';
export { Cottage, TownHouse, Hall, Mill, MarketStall, Well, Lamp, Bridge, Mountain } from '../art/houses';
