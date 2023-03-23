<template>
	<div class="file-selecter" @click="handleSelectFile">
		<i class="iconfont icon-shangchuanwenjian"></i>
		<p class="file-selecter-title">Click or drag file to this area to upload</p>
		<p class="file-selecter-subtitle">
			Support for a single or bulk upload. Strictly prohibit from uploading
			company data or other band files
		</p>
	</div>
</template>

<script setup>
import { open } from '@tauri-apps/api/dialog'

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	}
})

const emits = defineEmits(['update:modelValue'])

// 选择文件
const handleSelectFile = async () => {
	const selected = await open({
		multiple: true,
		filters: [
			{
				name: 'Excel',
				extensions: ['xls', 'xlsx']
			}
		]
	})

	if (selected) {
		emits('update:modelValue', [...props.modelValue, ...selected])
	}
}
</script>

<style lang="scss" scoped>
.file-selecter {
	padding: 24px;
	text-align: center;
	background-color: #f8f8f8;
	border: 1px dashed #d9d9d9;
	border-radius: 8px;
	user-select: none;

	&:hover {
		cursor: pointer;
		background-color: #f1f1f1;
	}

	.icon-shangchuanwenjian {
		font-size: 52px;
	}

	&-title {
		margin-bottom: 10px;
		font-size: 18px;
		font-weight: 500;
		color: $--default-text-color;
	}

	&-subtitle {
		margin-bottom: 0;
		font-size: 14px;
		color: #7b7b7b;
	}
}
</style>
