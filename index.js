const kbpgp = require('kbpgp')

module.exports.pgp = {
  async sign ({ payload, secretKey }) {
    return new Promise((resolve, reject) => {
      kbpgp.KeyManager.import_from_armored_pgp({ armored: secretKey }, (err, key) => {
        if (err) return reject(err)
        if (key.is_pgp_locked()) return reject(new Error('Private keys with passphrases are not yet supported'))
        const msg = Buffer.from(payload, 'utf8')
        kbpgp.box({ msg, sign_with: key }, (err, signature) => {
          if (err) return reject(err)
          // signature = signature.replace('BEGIN PGP MESSAGE', 'BEGIN PGP SIGNATURE')
          // signature = signature.replace('END PGP MESSAGE', 'END PGP SIGNATURE')
          resolve({ signature })
        })
      })
    })
  },
  async verify ({ payload, publicKey, signature }) {
    // signature = signature.replace('BEGIN PGP SIGNATURE', 'BEGIN PGP MESSAGE')
    // signature = signature.replace('END PGP SIGNATURE', 'END PGP MESSAGE')
    return new Promise((resolve, reject) => {
      kbpgp.KeyManager.import_from_armored_pgp({ armored: publicKey }, (err, key) => {
        if (err) return reject(err)
        const keyfetch = new kbpgp.keyring.KeyRing()
        keyfetch.add_key_manager(key)
      
        const data = Buffer.from(payload, 'utf8')
        const armored = signature
      
        kbpgp.unbox({ keyfetch, data, armored }, (err, literals) => {
          if (err) return reject(err)
          let invalid = []
          let valid = []
          for (let lit of literals) {
            let key = lit.get_data_signer().get_key_manager()
            valid.push(key.get_pgp_key_id().toString('hex'))
          }
          resolve({ valid, invalid })
        })
      })
    })
  }
}
