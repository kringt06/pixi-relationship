function pxyo() {
	export http_proxy="http://127.0.0.1:1080"
	export https_proxy="http://127.0.0.1:1080"
	export all_proxy="http://127.0.0.1:1080"
        echo 'proxy-on'
}

function pxyf() {
	unset http_proxy https_proxy all_proxy
        echo 'proxy-off'
}