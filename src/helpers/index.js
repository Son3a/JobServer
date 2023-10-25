module.exports.isEmail = value => /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(value)

module.exports.isPhone = value => /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(value)