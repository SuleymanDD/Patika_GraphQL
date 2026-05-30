import { gql } from "@apollo/client";

export const GET_CHARACTERS = gql`
query ($id: Int!, $filter: FilterCharacter) {
  characters(page: $id, filter: $filter) {
    results {
      id
      name
      type
      location {
        name
      }
      image
    }
    info {
      count
      pages
    }
  }
}
`;

export const GET_FILTERS_COUNTS = gql`
  query GetFilterCounts {
  maleCount: characters(filter: { gender: "Male" }) {
    info {
      count
    }
  }
  femaleCount: characters(filter: { gender: "Female" }) {
    info {
      count
    }
  }
  unknownGenderCount: characters(filter: { gender: "unknown" }) {
    info {
      count
    }
  }
  genderlessCount: characters(filter: { gender: "Genderless" }) {
    info {
      count
    }
  }
  humanCount: characters(filter: { species: "Human" }) {
    info {
      count
    }
  }
  alienCount: characters(filter: { species: "Alien" }) {
    info {
      count
    }
  }
  humanoidCount: characters(filter: { species: "Humanoid" }) {
    info {
      count
    }
  }
  animalCount: characters(filter: { species: "Animal" }) {
    info {
      count
    }
  }
  robotCount: characters(filter: { species: "Robot" }) {
    info {
      count
    }
  }
  cronenbergCount: characters(filter: { species: "Cronenberg" }) {
    info {
      count
    }
  }
  mythologCount: characters(filter: { species: "Mytholog" }) {
    info {
      count
    }
  }
  diseaseCount: characters(filter: { species: "Disease" }) {
    info {
      count
    }
  }
  poopybuttholeCount: characters(filter: { species: "Poopybutthole" }) {
    info {
      count
    }
  }
  unknownSpeciesCount: characters(filter: { species: "unknown" }) {
    info {
      count
    }
  }
  earthC137Count: locations(filter: { name: "Earth (C-137)" }) {
    results {
      residents {
        id
      }
    }
  }
  earthReplacementDimensionCount: locations(filter: { name: "Earth (Replacement Dimension)" }) {
    results {
      residents {
        id
      }
    }
  }
  citadelofRicksCount: locations(filter: { name: "Citadel of Ricks" }) {
    results {
      residents {
        id
      }
    }
  }
  interdimensionalCableCount: locations(filter: { name: "Interdimensional Cable" }) {
    results {
      residents {
        id
      }
    }
  }
  worldenderslairCount: locations(filter: { name: "Worldender's lair" }) {
    results {
      residents {
        id
      }
    }
  }
}
`;

export const GET_LOCATIONS = gql`
  query($locationName: String!) {
  locations(filter: {name: $locationName}) {
    results {
      name
      residents{
        id
      }
    }
  }
}
`;

export const GET_CHARACTERS_WITH_IDS = gql`
  query($ids: [ID!]!) {
  charactersByIds(ids: $ids) {
    id
    name
    status
    species
    gender
    image
    location{
      name
    }
  }
}
`;