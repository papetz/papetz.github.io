# Understanding Verification Bias in Two-Stage Designs

*March 2026*

In many diagnostic studies, only screen-positive individuals undergo gold-standard verification. This induces verification bias, systematically inflating sensitivity and deflating specificity.

## Formal Structure

Let D denote disease status and T the screening test. If only a subset of T = 0 cases are verified, the observed counts become biased estimators of:

```
Sensitivity = P(T = 1 | D = 1)
Specificity = P(T = 0 | D = 0)
```

A Bayesian correction model treats the missing verifications as latent data and integrates over posterior uncertainty.
