<template>
  <div></div>
</template>
<script>
import GithubAuthAccessToken from '~/gql/GithubAuthAccessToken.gql'


export default {
  async mounted() {
    const { accessToken } = await this.$apollo.mutate({
      mutation: GithubAuthAccessToken,
      variables: {
        code: this.$route.query.code,
      },
    }).then(({ data }) => data)
    await this.$apolloHelpers.onLogin(accessToken.accessToken)
    this.$router.replace('/')
  },
}
</script>
