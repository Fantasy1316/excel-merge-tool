import * as XLSX from 'xlsx'

export const ReadExcelFile = (file) => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.readAsArrayBuffer(file)
		fileReader.onload = (event) => {
			try {
				const buffer = event.target.result
				const wb = XLSX.read(buffer, { type: 'binary' })
				const sheet = wb.Sheets[wb.SheetNames[0]]
				const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })
				const header = data[0]
				const content = data.slice(1)

				resolve({
					header,
					content
				})
			} catch (error) {
				reject(error)
			}
		}
	})
}

export const MergeExcelFile = ({
	multiHeader = [],
	header,
	data,
	filename,
	merges = [],
	autoWidth = true,
	bookType = 'xlsx'
}) => {
	/* original data */
	filename = filename || 'excel-list'
	data = [...data]
	data.unshift(header)

	for (let i = multiHeader.length - 1; i > -1; i--) {
		data.unshift(multiHeader[i])
	}

	const ws_name = 'Sheet1'
	const wb = new Workbook(),
		ws = _sheet_from_array_of_arrays(data)

	if (merges.length > 0) {
		if (!ws['!merges']) ws['!merges'] = []
		merges.forEach((item) => {
			ws['!merges'].push(XLSX.utils.decode_range(item))
		})
	}

	if (autoWidth) {
		/*设置worksheet每列的最大宽度*/
		const colWidth = data.map((row) =>
			row.map((val) => {
				/*先判断是否为null/undefined*/
				if (val == null) {
					return {
						wch: 10
					}
				} else if (val.toString().charCodeAt(0) > 255) {
					/*再判断是否为中文*/
					return {
						wch: val.toString().length * 2
					}
				} else {
					return {
						wch: val.toString().length
					}
				}
			})
		)
		/*以第一行为初始值*/
		let result = colWidth[0]
		for (let i = 1; i < colWidth.length; i++) {
			for (let j = 0; j < colWidth[i].length; j++) {
				if (result[j]['wch'] < colWidth[i][j]['wch']) {
					result[j]['wch'] = colWidth[i][j]['wch']
				}
			}
		}
		ws['!cols'] = result
	}

	/* add worksheet to workbook */
	wb.SheetNames.push(ws_name)
	wb.Sheets[ws_name] = ws

	const wbout = XLSX.write(wb, {
		bookType: bookType,
		bookSST: false,
		type: 'binary'
	})

	return _s2ab(wbout)
}

function Workbook() {
	if (!(this instanceof Workbook)) return new Workbook()
	this.SheetNames = []
	this.Sheets = {}
}

const _s2ab = (s) => {
	var buf = new ArrayBuffer(s.length)
	var view = new Uint8Array(buf)
	for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
	return buf
}

const _sheet_from_array_of_arrays = (data) => {
	const ws = {}
	const range = {
		s: {
			c: 10000000,
			r: 10000000
		},
		e: {
			c: 0,
			r: 0
		}
	}
	for (let R = 0; R != data.length; ++R) {
		for (let C = 0; C != data[R].length; ++C) {
			if (range.s.r > R) range.s.r = R
			if (range.s.c > C) range.s.c = C
			if (range.e.r < R) range.e.r = R
			if (range.e.c < C) range.e.c = C
			let cell = {
				v: data[R][C]
			}
			if (cell.v == null) continue
			let cell_ref = XLSX.utils.encode_cell({
				c: C,
				r: R
			})

			if (typeof cell.v === 'number') cell.t = 'n'
			else if (typeof cell.v === 'boolean') cell.t = 'b'
			else if (cell.v instanceof Date) {
				cell.t = 'n'
				cell.z = XLSX.SSF._table[14]
				cell.v = datenum(cell.v)
			} else cell.t = 's'

			ws[cell_ref] = cell
		}
	}

	if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range)
	return ws
}
