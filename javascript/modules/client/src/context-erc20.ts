import { Context, ContextParams as MainContextParams } from "./context";

type ContextErc20State = {
  pluginAddress: string;
};
export type ContextErc20Params = MainContextParams & {
  pluginAddress: string;
};

// State
const defaultState: ContextErc20State = {
  pluginAddress: "",
};

export class ContextErc20 extends Context {
  private erc20State: ContextErc20State = Object.assign({}, defaultState);

  // INTERNAL CONTEXT STATE

  /**
   * @param {ContextErc20Params} params The parameters for the client context
   *
   * @constructor
   */
  constructor(params: Partial<ContextErc20Params>) {
    super(params);

    this.set(params);
  }

  /**
   * Does set and parse the given context configuration object
   *
   * @method setFull
   *
   * @returns {void}
   *
   * @private
   */
  setFull(contextParams: ContextErc20Params): void {
    super.setFull(contextParams);

    if (contextParams?.pluginAddress?.length != 42) {
      throw new Error("Invalid plugin address");
    }

    this.erc20State = {
      pluginAddress: contextParams.pluginAddress,
    };
  }

  set(contextParams: Partial<ContextErc20Params>) {
    super.set(contextParams);

    if (contextParams.pluginAddress) {
      this.erc20State.pluginAddress = contextParams.pluginAddress;
    }
  }

  // GETTERS

  /**
   * Returns the plugin contract address used to interact with
   *
   * @var pluginAddress
   *
   * @returns {string}
   *
   * @public
   */
  get pluginAddress() {
    return this.erc20State.pluginAddress || defaultState.pluginAddress;
  }

  // DEFAULT CONTEXT STATE
  static setDefault(params: Partial<ContextErc20Params>) {
    super.setDefault(params);

    if (params.pluginAddress) {
      defaultState.pluginAddress = params.pluginAddress;
    }
  }
  static getDefault() {
    return Object.assign(super.getDefault(), defaultState);
  }
}
