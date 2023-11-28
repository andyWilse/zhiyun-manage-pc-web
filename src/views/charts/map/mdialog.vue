<template>
<transition name="dialog">
	<div
		v-if="showDialog"
		id="dialog-bg"
		@touchmove.prevent
		@scroll.prevent >
		<div id="dialog" >
			<h2
				style="text-align: left;padding-left: 10px;">
				{{title}}
			</h2>
			<p
				style="text-align: left;padding-left: 10px;word-wrap:break-word;">
				{{message}}
			</p>
			<button
				class="dialog-button"
				@click="close" >X</button>
		</div>
	</div>
</transition>
</template>

<script>

	export default{
		props:{
			showDialog: Boolean,
			title: String,
			message: String
		},

		methods: {
			close: function(){
				this.$emit("closeDialog");
			}
		},

		watch:{

		}

	}
</script>

<style>
	* {
		box-sizing: border-box;
	}

	#dialog-bg{
		top: 0;
		left: 0;
		position: fixed;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0,0,0,0.5);
		z-index: 98;
	}

	#dialog{
		border-radius: 20px 20px 0 0;
		position: fixed;
		bottom: 0;
		background-color: #FFFFFF;
		width: 100vw;
		padding: 15px;
		padding-bottom: 25px;
	}

	/* 适配电脑等大屏幕 */
	@media (min-width: 750px) {
		#dialog{
			width: 1000px;
			left:0;
			right:0;
			margin:0 auto;
		}
	}

	.dialog-button{
		width: 5%;
		left:0px;
		background-color: #6367D5;
		border-width: 0;
		border-radius: 360px;
		padding: 5px;
		outline: none;
		color: white;
	}

	.dialog-button:focus {
		outline: none;
	}

	.dialog-button:active{
		background-color: #585dbe;
		border-color: #585dbe;
	}


	.dialog-enter-active, .dialog-leave-active {
	  transition: all .5s;
	}

	.dialog-enter, .dialog-leave-to {
	  opacity: 0;
	  transform: translateY(300px);
	}


</style>

