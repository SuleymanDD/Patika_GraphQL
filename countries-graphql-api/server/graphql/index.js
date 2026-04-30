import { continents, countries, languages } from '../data';

export const type_defs = `
    type Continent{
        code: ID!
        name: String!
        countries: [Country!]!
    }

    type Country{
        awsRegion: String!
        capital: String
        code: ID!
        continent: Continent!
        currencies: [String!]!
        currency: String
        emoji: String!
        emojiU: String!
        languages: [Language!]!
        name(lang: String): String!
        native: String!
        phone: String!
        phones: [String!]!
    }

    type Language{
        code: ID!
        countries: [Country!]!
        name: String!
        native: String!
        rtl: Boolean!
    }

    type Query{
        continents: [Continent!]
        continent(code: ID!): Continent
        countries: [Country!]
        country(code: ID!): Country
        languages: [Language!]
        language(code: ID!): Language
    }

`;

export const resolvers = {
    Query: {
        continents: () => continents,
        continent: (_, args) => continents.find(continent => continent.code === args.code),
        countries: () => countries,
        country: (_, args) => countries.find(country => country.code === args.code),
        languages: () => languages,
        language: (_, args) => languages.find(language => language.code === args.code),
    },
    Continent:{
        countries: (parent,__) => countries.filter(country => country.continent_code === parent.code),
    },
    Country: {
        languages: (parent,__) => languages.filter(language => parent.languages_codes.includes(language.code)),
        continent: (parent,__) => continents.find(continent => continent.code === parent.continent_code),
    },
    Language:{
        countries: (parent,__) => countries.filter(country => country.languages_codes.includes(parent.code)),
    }
};  