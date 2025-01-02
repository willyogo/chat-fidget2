export const GET_FARCASTER_IDENTITY = `
  query GetFarcasterIdentity($address: Address!) {
    Socials(
      input: {
        filter: {
          userAssociatedAddresses: { _eq: $address },
          dappName: { _eq: farcaster }
        },
        blockchain: ethereum
      }
    ) {
      Social {
        dappName
        profileName
        profileImage
      }
    }
  }
`;