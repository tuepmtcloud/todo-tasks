import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJezLZIoCNaD9+MA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1pYzd6b3hwanJyYnR5ajFqLnVzLmF1dGgwLmNvbTAeFw0yMzEyMTUx
MzU0NDlaFw0zNzA4MjMxMzU0NDlaMCwxKjAoBgNVBAMTIWRldi1pYzd6b3hwanJy
YnR5ajFqLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAKyk4VRK8TGBbqIKXKytpH1OgojKEzPqff/SzJz8QzTwZ73k0Zx/wKdG7qAE
OhI4VkiI068GHP6DmyOV0GDbtc1FbeEHBxD7Cp84zECoIjTowXtHB1gTcXFgwMas
FPgbzCx3zo55JMTRWXlye2tCq/lpUW4bBtTMj7pvPPqdwT4IdBetz02mGIs88qxV
i1Gz4yb44cp3Or24YTbgcGA6gqz51uE4/pwaPSPjuFnqiMI4hdv9ekh5E2emszm1
YZAH24A/HAwqHFx99GGc/TQVnuyQqq+oPUwXvfh9LHBDkLVTUYF2qq0Qq3xRhKk2
uIKwugOpoG2ru0mZI9IhjDMHgR8CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUVVE5/EXqs0F6jRDDsu3EZVIuFYEwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQCMsJBKKNpdI+5iFExgCVEX1f0Aqt6CRvLoSbqP8hPn
6oe0WMpVyL5W6e1U9oZ3K6Jmwr8xVMEHkWvrVVJeG0NfAd/YlX/tKsIu27fYUrR5
id5mMkNYMEj4qNT1RBOFvhx2SCpHzr/e9AJRomAidizeNRbRtYG4RmeWX8ehOrhe
F55ECAfFTqGthYMGMr+MwfpeQt/sCUG5DdIKHC69suyipy8LXHIsVmiO5dFPc1rE
6prMxesYOcD6ytuBVDT/pcxIzOlznsg+omNprLYo7vtEa/uQrvB6u8Q4Cg1T3eUr
Tuoy03Hqe2PWqBosfB8wMvxGGmDxrY5gic5B+Fj2w67D
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification
  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
