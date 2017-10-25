import test from 'ava'

import util from '../lib/util'

test('ucfirst', t => {
	t.is(util.ucfirst('user'), 'User')
})

test('substitute', t => {
	t.is(util.substitute('{{ var }}', {
		var: 'var1'
	}), 'var1')
})