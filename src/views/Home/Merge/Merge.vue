<template>
	<div class="merge">
		<div class="merge-uploader">
			<a-upload-dragger
				v-model:fileList="fileList"
				action="#"
				:customRequest="customRequest"
				name="file"
				:multiple="true"
				:showUploadList="false"
				@change="handleUploaderChange"
			>
				<p class="ant-upload-drag-icon">
					<i class="iconfont icon-shangchuanwenjian"></i>
				</p>
				<p class="ant-upload-text">Click or drag file to this area to upload</p>
				<p class="ant-upload-hint">
					Support for a single or bulk upload. Strictly prohibit from uploading
					company data or other band files
				</p>
			</a-upload-dragger>
		</div>
		<div class="merge-files">
			<ul class="merge-files-list">
				<li class="list-item" v-for="(file, index) in fileList" :key="file.uid">
					<i class="iconfont icon-excel"></i>
					<span class="list-item-name">{{ index + 1 }}. {{ file.name }}</span>
					<i class="iconfont icon-shanchu"></i>
				</li>
			</ul>
		</div>
		<div class="merge-button">
			<a-button size="large" danger @click="hadnleClearAll">全部清除</a-button>
			<a-button type="primary" size="large" @click="handleMergeFiles"
				>合并文件</a-button
			>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { writeBinaryFile, BaseDirectory, exists } from '@tauri-apps/api/fs'
import { downloadDir } from '@tauri-apps/api/path'
import { message, confirm } from '@tauri-apps/api/dialog'
import { open } from '@tauri-apps/api/shell'
import { ReadExcelFile, MergeExcelFile } from '@/utils/excelFileResolve'

const fileList = ref([])
const handleUploaderChange = (file) => {
	fileList.value = file.fileList
}

const handleMergeFiles = async () => {
	if (fileList.value.length < 2) {
		message('请选择需要合并的文件, 至少2个', {
			title: '文件合并失败',
			type: 'warning'
		})
		return
	}
	let xlsHeader = []
	let xlsData = []

	for (let i = 0; i < fileList.value.length; i++) {
		const file = fileList.value[i]

		const result = await ReadExcelFile(file.originFileObj)
		const { header, content } = result

		if (!xlsHeader.length) {
			xlsHeader = header
			xlsData = content
		} else {
			if (xlsHeader.toString() !== header.toString()) {
				message('文件表头不一致，合并失败', {
					title: '文件合并失败',
					type: 'error'
				})
				return
			} else {
				xlsData = [...xlsData, ...content]
			}
		}
	}

	const data = MergeExcelFile({ header: xlsHeader, data: xlsData })

	const fileName = `ExcelMergeTool_${Date.now()}.xlsx`
	const dir = {
		dir: BaseDirectory.Download
	}

	await writeBinaryFile(fileName, data, dir)
	const isExists = await exists(fileName, dir)

	if (isExists) {
		const filePosition = await downloadDir()

		const confirmed = await confirm(`保存路径：${filePosition}${fileName}`, {
			title: '文件合并成功，打开文件？',
			type: 'info'
		})

		if (confirmed) {
			await open(`${filePosition}${fileName}`)
		}
	}
}

const hadnleClearAll = () => {
	fileList.value = []
}

const customRequest = () => {
	return false
}
</script>

<style lang="scss" scoped>
.merge {
	display: flex;
	flex-direction: column;
	height: 100%;

	&-uploader {
		.icon-shangchuanwenjian {
			font-size: 48px;
			color: $--default-text-color;
		}

		&::v-deep(.ant-upload.ant-upload-drag p.ant-upload-drag-icon) {
			margin-bottom: 0;
		}
	}

	&-files {
		flex: 1;
		margin: 10px 0;
		overflow-y: scroll;

		&::-webkit-scrollbar {
			width: 4px;
			background: #fff;
		}

		&::-webkit-scrollbar-thumb {
			margin-left: 10px;
			border-radius: 8px;
			background-color: #ccc;
		}

		&-list {
			.list-item {
				display: flex;
				align-items: center;
				padding: 5px 10px;
				margin-right: 4px;

				&:hover {
					background-color: #efefef;
					border-radius: 5px;
				}

				&-name {
					flex: 1;
					margin: 0 10px;
					font-size: 14px;
					color: $--default-text-color;
				}

				.icon-shanchu {
					color: #ccc;

					&:hover {
						color: #ff5e5e;
						font-weight: 500;
					}
				}
			}
		}
	}

	&-button {
		display: flex;
		justify-content: center;

		&::v-deep(.ant-btn-primary) {
			margin-left: 5px;
			border-color: $--primary-color;
			background-color: $--primary-color;
		}

		&::v-deep(.ant-btn-dangerous) {
			margin-right: 5px;
			border-color: $--primary-color;
			color: $--primary-color;
		}
	}
}
</style>
