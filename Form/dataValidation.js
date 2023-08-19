const dataVAlidation = (data) => {
	return data.name?.length && data.pass.length && data.email.length && data.email.includes('@')
}

module.exports = dataVAlidation;