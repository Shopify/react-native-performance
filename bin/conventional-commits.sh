#!/bin/sh


# We check if there is only one commit or more
# If there is one, we only check whether commits are conventional, otherwise we check whether the PR title _or_ commit messages are conventional.
if [ 1 -eq $2 ]; then
    commitlint --from HEAD~1 --to HEAD
else
    echo "$1" | commitlint || (commitlint --from HEAD~$2 --to HEAD)
fi
